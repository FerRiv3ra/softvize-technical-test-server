import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { REQUEST_USER_KEY } from 'src/common/constants/constants';
import { IActiveUser } from '../interface';

export const GetUser = createParamDecorator(
  (field: keyof IActiveUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: IActiveUser | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);
