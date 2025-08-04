import { SetMetadata } from '@nestjs/common';
import { TOKEN_TYPE_KEY } from 'src/common/constants/constants';
import { TokenTypeEnum } from '../enums';

export const TokenType = (tokenType: TokenTypeEnum) =>
  SetMetadata(TOKEN_TYPE_KEY, tokenType);
