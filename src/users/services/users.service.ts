import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, isValidObjectId, Model } from 'mongoose';

import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { isEmail } from 'class-validator';
import { jwtConfig } from 'config/server.config';
import { SoftDeleteModel } from 'mongoose-delete';
import { ConnectionsService } from 'src/connections/services/connections.service';
import { TokenTypeEnum } from 'src/iam/enums';
import { IActiveUser } from 'src/iam/interface';
import { CreateUserDto, UpdateUserDto } from '../dto/create-user.dto';
import { User, UserDocument } from '../entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private readonly jwtService: JwtService,
    private readonly connectionService: ConnectionsService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      const user = await this.userModel.create(createUserDto);

      return user as UserDocument;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Email already registered');
      }

      this.logger.error(error.message);
      throw new InternalServerErrorException(
        'An error occurred while creating the user',
      );
    }
  }

  async loadSeed(seedData: any[]): Promise<void> {
    try {
      await Promise.all([
        this.userModel.deleteMany({}),
        this.connectionService.removeAll(),
      ]);
      // Insert the seed data into the database

      await this.userModel.insertMany(seedData);
    } catch (error) {
      this.logger.error('Error loading seed data', error);
      throw new InternalServerErrorException('Failed to load seed data');
    }
  }

  async findOne(field: string): Promise<UserDocument | null> {
    if (isValidObjectId(field)) {
      return await this.userModel.findById(field);
    }

    if (isEmail(field)) {
      return await this.userModel.findOne({ email: field });
    }

    return null;
  }

  async getUserBy(
    query: FilterQuery<User>,
    session?: ClientSession,
  ): Promise<UserDocument | null> {
    return (await this.userModel
      .findOne({ ...query })
      .session(session ?? null)) as UserDocument | null;
  }

  createToken(
    user: UserDocument | IActiveUser,
    tokenType: TokenTypeEnum,
  ): Promise<string> {
    const sub: string = 'id' in user ? user.id : (user as IActiveUser).sub;
    return this.jwtService.signAsync(
      {
        sub,
        email: user.email,
        tokenType,
      } as IActiveUser,
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret:
          tokenType === TokenTypeEnum.AccessToken
            ? this.jwtConfiguration.accessSecret
            : this.jwtConfiguration.refreshSecret,
        expiresIn:
          tokenType === TokenTypeEnum.AccessToken
            ? this.jwtConfiguration.accessTokenTtl
            : this.jwtConfiguration.refreshTokenTtl,
      },
    );
  }

  async updateInfo(userId: string, updateUserDto: UpdateUserDto) {
    const { username, email } = updateUserDto;

    if (!username && !email) {
      throw new BadRequestException('No fields to update provided');
    }

    if (email) {
      const emailExist = await this.getUserBy({ email });
      if (!!emailExist) {
        throw new BadRequestException('Email already registered');
      }
    }
    const user = await this.updateUserBy({ _id: userId }, updateUserDto);

    return user;
  }

  async updateUserBy(
    query: FilterQuery<User>,
    data: Partial<UserDocument>,
  ): Promise<UserDocument> {
    const user = await this.userModel.findOneAndUpdate(query, data, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user as UserDocument;
  }

  async deleteAccount(
    userId: string,
    session?: ClientSession,
  ): Promise<string> {
    let localSession: ClientSession | null = null;

    if (!session) {
      localSession = await this.userModel.db.startSession();
      localSession.startTransaction();
      session = localSession;
    }

    try {
      await (this.userModel as SoftDeleteModel<UserDocument>).delete(
        { _id: userId },
        { session },
      );

      if (localSession) {
        await session.commitTransaction();
      }

      return userId;
    } catch (error) {
      if (localSession) {
        await session.abortTransaction();
      }
      throw error;
    } finally {
      if (localSession) {
        localSession.endSession();
      }
    }
  }
}
