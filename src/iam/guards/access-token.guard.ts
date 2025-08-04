import { Request } from 'express';

import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

import { jwtConfig } from 'config/server.config';
import {
  REQUEST_USER_KEY,
  TOKEN_TYPE_KEY,
} from 'src/common/constants/constants';
import { UsersService } from 'src/users/services/users.service';
import { TokenTypeEnum } from '../enums';
import { IActiveUser } from '../interface';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly userService: UsersService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  public async canActivate(ctx: ExecutionContext): Promise<boolean> | never {
    const request = ctx.switchToHttp().getRequest();
    const token = this.extractTokenFromHeaders(request);
    const ctxTokenType =
      this.reflector.getAllAndOverride(TOKEN_TYPE_KEY, [
        ctx.getHandler(),
        ctx.getClass(),
      ]) ?? TokenTypeEnum.AccessToken;

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      const payload: IActiveUser & {
        iat: number;
        exp: number;
        aud: string;
        iss: string;
      } = await this.jwtService.verifyAsync(token, {
        secret:
          ctxTokenType === TokenTypeEnum.AccessToken
            ? this.jwtConfiguration.accessSecret
            : this.jwtConfiguration.refreshSecret,
        ...this.jwtConfiguration,
      });

      request[REQUEST_USER_KEY] = payload;
      const user = await this.userService.getUserBy({ _id: payload.sub });

      const isUserUnauthorized = !user;

      if (isUserUnauthorized) {
        throw new UnauthorizedException('Invalid token');
      }
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractTokenFromHeaders(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
