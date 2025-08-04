import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPE_KEY } from 'src/common/constants/constants';
import { AuthTypeEnum } from '../enums/auth-type.enum';

export const Auth = (...authType: AuthTypeEnum[]) =>
  SetMetadata(AUTH_TYPE_KEY, authType);
