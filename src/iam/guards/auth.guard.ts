import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AUTH_TYPE_KEY } from 'src/common/constants/constants';
import { AuthTypeEnum } from '../enums';
import { AccessTokenGuard } from './access-token.guard';

@Injectable()
export class AuthGuard implements CanActivate {
  private static readonly defaultAuthType = AuthTypeEnum.Bearer;
  private readonly authTypeGuardMap: Record<
    AuthTypeEnum,
    CanActivate | CanActivate[]
  >;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthTypeEnum.Bearer]: this.accessTokenGuard,
      [AuthTypeEnum.None]: { canActivate: () => true },
    };
  }

  public async canActivate(ctx: ExecutionContext): Promise<boolean> | never {
    const authType = this.reflector.getAllAndOverride<AuthTypeEnum[]>(
      AUTH_TYPE_KEY,
      [ctx.getHandler(), ctx.getClass()],
    ) ?? [AuthGuard.defaultAuthType];
    const guards = authType.map((type) => this.authTypeGuardMap[type]).flat();
    let error = new UnauthorizedException();
    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(ctx),
      ).catch((err) => {
        error = err;
      });
      if (canActivate) return true;
    }
    throw error;
  }
}
