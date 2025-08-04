import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';

export class Tokens {
  @ApiProperty({ type: String, description: 'Access token' })
  readonly accessToken: string;

  @ApiProperty({ type: String, description: 'Refresh token' })
  readonly refreshToken: string;
}

export function LoginUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'User login to the application',
    }),
    ApiBody({
      type: LoginDto,
    }),
    ApiOkResponse({
      description: 'User was successfully logged in. Return tokens',
      type: Tokens,
    }),
    ApiBadRequestResponse({
      description: 'The email or password of user is not valid',
    }),
  );
}
