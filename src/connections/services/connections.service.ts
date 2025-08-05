import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Page } from 'src/common/helpers/page-response.helper';
import { CreateConnectionDto } from '../dto/create-connection.dto';
import { Connection, ConnectionDocument } from '../entities/connection.entity';

@Injectable()
export class ConnectionsService {
  private readonly logger = new Logger(ConnectionsService.name);

  constructor(
    @InjectModel(Connection.name)
    private readonly connectionModel: Model<Connection>,
  ) {}

  async create(
    createConnectionDto: CreateConnectionDto,
    userId: string,
  ): Promise<Connection> {
    const { connectedUser } = createConnectionDto;

    if (!connectedUser || !userId) {
      throw new NotFoundException('Connected user or user ID not provided');
    }

    if (connectedUser === userId) {
      throw new NotFoundException('Cannot connect to yourself');
    }

    const [existingConnection1, existingConnection2] = await Promise.all([
      this.connectionModel.findOne<ConnectionDocument>({
        user: userId,
        connectedUser,
      }),
      this.connectionModel.findOne<ConnectionDocument>({
        user: connectedUser,
        connectedUser: userId,
      }),
    ]);

    if (existingConnection1 && existingConnection2) {
      if (existingConnection1.deleted && !existingConnection2.deleted) {
        await Promise.all([
          (this.connectionModel as SoftDeleteModel<Connection>).restore({
            _id: existingConnection1._id,
          }),
          (this.connectionModel as SoftDeleteModel<Connection>).restore({
            _id: existingConnection2._id,
          }),
        ]);

        return existingConnection1;
      } else {
        throw new BadRequestException(
          'Connection already exists between these users',
        );
      }
    }

    const connection1 = new this.connectionModel({
      user: userId,
      connectedUser,
    });
    const connection2 = new this.connectionModel({
      user: connectedUser,
      connectedUser: userId,
    });

    await Promise.all([connection1.save(), connection2.save()]);

    return connection1;
  }

  async findAll(pagination: PaginationDto, userId: string) {
    const { limit, page, filter, sort, sortOrder } = pagination;
    const skip = (page - 1) * limit;
    const query: FilterQuery<Connection> = filter
      ? JSON.parse(filter)
      : { deleted: false };
    const order = sortOrder === 'asc' ? 1 : -1;

    query.user = userId;

    const [data, totalCount] = await Promise.all([
      this.connectionModel
        .find(query)
        .sort({ [sort]: order })
        .skip(skip)
        .limit(limit)
        .populate('connectedUser', 'name email avatar')
        .exec(),
      this.connectionModel.countDocuments(query).exec(),
    ]);

    return new Page<Connection>(data, totalCount, page, limit);
  }
  catch(error: any) {
    this.logger.error('Error finding connections', error);

    throw new InternalServerErrorException(
      'An error occurred while retrieving connections. Please try again later.',
    );
  }

  async removeAll() {
    await this.connectionModel.deleteMany({});

    return 'All connections removed successfully';
  }

  async remove(id: string) {
    const connection = await this.connectionModel.findById(id);

    if (!connection) {
      throw new NotFoundException('Connection not found or already deleted');
    }

    const secondConnection = await this.connectionModel.findOne({
      user: connection.connectedUser,
      connectedUser: connection.user,
    });

    if (!secondConnection) {
      throw new NotFoundException('Related connection not found');
    }

    try {
      await Promise.all([
        (this.connectionModel as SoftDeleteModel<Connection>).delete({
          _id: connection._id,
        }),
        (this.connectionModel as SoftDeleteModel<Connection>).delete({
          _id: secondConnection._id,
        }),
      ]);

      return id;
    } catch (error) {
      this.logger.error(
        `Error deleting connection: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
