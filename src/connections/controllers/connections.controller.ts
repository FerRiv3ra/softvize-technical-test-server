import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { swaggerAuth } from 'src/common/constants/constants';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { baseResponseHelper } from 'src/common/helpers/base-response.helper';
import { ParseMongoIdPipe } from 'src/common/pipes/parseMongoId.pipe';
import { TokenType } from 'src/iam/decorators';
import { GetUser } from 'src/iam/decorators/get-user.decorator';
import { TokenTypeEnum } from 'src/iam/enums';
import { CreateConnectionDto } from '../dto/create-connection.dto';
import { ConnectionsService } from '../services/connections.service';

@Controller({ path: 'connections', version: '1' })
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post()
  @ApiBearerAuth(swaggerAuth)
  @TokenType(TokenTypeEnum.AccessToken)
  async create(
    @Body() createConnectionDto: CreateConnectionDto,
    @GetUser('sub') userId: string,
  ) {
    const response = await this.connectionsService.create(
      createConnectionDto,
      userId,
    );

    return baseResponseHelper(response);
  }

  @Get()
  @ApiBearerAuth(swaggerAuth)
  @TokenType(TokenTypeEnum.AccessToken)
  async findAll(
    @Query() pagination: PaginationDto,
    @GetUser('sub') userId: string,
  ) {
    const response = await this.connectionsService.findAll(pagination, userId);

    return baseResponseHelper(response);
  }

  @Delete(':id')
  @ApiBearerAuth(swaggerAuth)
  @TokenType(TokenTypeEnum.AccessToken)
  async remove(@Param('id', ParseMongoIdPipe) id: string) {
    const response = await this.connectionsService.remove(+id);

    return baseResponseHelper(response);
  }
}
