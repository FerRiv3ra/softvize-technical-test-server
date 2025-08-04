import { TokenTypeEnum } from '../enums';

export interface IActiveUser {
  sub: string;
  email: string;
  tokenType: TokenTypeEnum;
}
