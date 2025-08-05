import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { TokenTypeEnum } from 'src/iam/enums';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { IActiveUser } from 'src/iam/interface';
import { UsersSeed } from 'src/users/data/users.seed';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDocument } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { LoginDto } from '../dto/login.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashingService: HashingService,
  ) {}

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<boolean> {
    const { email } = verifyEmailDto;

    const user = await this.userService.getUserBy({ email });

    if (!!user) {
      return false;
    } else {
      return true;
    }
  }

  async loadSeed(): Promise<string> {
    const newUsers = await Promise.all(
      UsersSeed.map(async (user) => ({
        ...user,
        password: await this.hashingService.hash(user.password),
      })),
    );

    await this.userService.loadSeed(newUsers);

    return 'Seed data loaded successfully';
  }

  async registration(userDto: CreateUserDto): Promise<{
    user: UserDocument;
    accessToken: string;
    refreshToken: string;
  }> {
    const userExist = await this.userService.getUserBy({
      email: userDto.email,
    });
    if (userExist) {
      throw new BadRequestException('Email already registered');
    }

    const user = await this.userService.create(
      userDto,
      `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
    );
    const [accessToken, refreshToken] = await Promise.all([
      this.userService.createToken(user, TokenTypeEnum.AccessToken),
      this.userService.createToken(user, TokenTypeEnum.RefreshToken),
    ]);

    return { user, accessToken, refreshToken };
  }

  async login(loginDto: LoginDto): Promise<{
    user: UserDocument;
    accessToken: string;
    refreshToken: string;
  }> {
    const { identifier, password } = loginDto;
    const user = await this.userService.findOne(identifier);
    let expoTokenUpdated = false;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const correctPassword = await this.hashingService.compare(
      password,
      user.password,
    );
    if (!correctPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    if (expoTokenUpdated) await user.save();

    const [accessToken, refreshToken] = await Promise.all([
      this.userService.createToken(user, TokenTypeEnum.AccessToken),
      this.userService.createToken(user, TokenTypeEnum.RefreshToken),
    ]);
    return { user, accessToken, refreshToken };
  }

  async refresh(
    user: IActiveUser,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.userService.createToken(user, TokenTypeEnum.AccessToken),
        this.userService.createToken(user, TokenTypeEnum.RefreshToken),
      ]);
      return { accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedException('Token refresh failed');
    }
  }
}
