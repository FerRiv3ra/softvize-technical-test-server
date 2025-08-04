import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EnvKeysEnum } from 'config/env.enum';
import { swaggerAuth } from 'src/common/constants/constants';
import { BaseResponse } from 'src/common/dto/base-response.dto';
import { baseResponseHelper } from 'src/common/helpers/base-response.helper';
import { Auth, TokenType } from 'src/iam/decorators';
import { GetUser } from 'src/iam/decorators/get-user.decorator';
import { AuthTypeEnum, TokenTypeEnum } from 'src/iam/enums';
import { IActiveUser } from 'src/iam/interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDocument } from 'src/users/entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { AuthService } from '../services/auth.service';
import { LoginUserDocs } from '../swagger/login-user.docs';

@ApiTags('Auth')
@Controller({ path: 'auth', version: ['1'] })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('health-check')
  @Auth(AuthTypeEnum.None)
  @HttpCode(HttpStatus.OK)
  healthCheck() {
    return process.env[EnvKeysEnum.NODE_ENV];
  }

  @Get('load-seed')
  @Auth(AuthTypeEnum.None)
  @HttpCode(HttpStatus.OK)
  async loadSeed(): Promise<BaseResponse<string>> {
    const response = await this.authService.loadSeed();

    return baseResponseHelper(response);
  }

  @Auth(AuthTypeEnum.None)
  @Post('verify-email')
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<BaseResponse<boolean>> {
    return baseResponseHelper(
      await this.authService.verifyEmail(verifyEmailDto),
    );
  }

  @Auth(AuthTypeEnum.None)
  @Post('sign-up')
  async registration(@Body() userDto: CreateUserDto): Promise<
    BaseResponse<{
      user: UserDocument;
      accessToken: string;
      refreshToken: string;
    }>
  > {
    const response = await this.authService.registration(userDto);

    return baseResponseHelper(response);
  }

  @Auth(AuthTypeEnum.None)
  @Post('sign-in')
  @LoginUserDocs()
  async login(@Body() loginDto: LoginDto): Promise<
    BaseResponse<{
      user: UserDocument;
      accessToken: string;
      refreshToken: string;
    }>
  > {
    const response = await this.authService.login(loginDto);

    return baseResponseHelper(response);
  }

  @Get('refresh')
  @ApiBearerAuth(swaggerAuth)
  @TokenType(TokenTypeEnum.RefreshToken)
  async refresh(
    @GetUser() activeUser: IActiveUser,
  ): Promise<BaseResponse<{ accessToken: string; refreshToken: string }>> {
    const response = await this.authService.refresh(activeUser);

    return baseResponseHelper(response);
  }
}
