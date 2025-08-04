import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, NotContains } from 'class-validator';

/**
 * Data Transfer Object for user login.
 * Accepts either username or email as identifier and a password.
 */
export class LoginDto {
  /**
   * Username or email used for login.
   */
  @ApiProperty({
    example: 'user@example.com',
    description: 'Username or email for login',
  })
  @IsString()
  @IsNotEmpty()
  readonly identifier: string;

  /**
   * User's password. Must not contain spaces.
   */
  @ApiProperty({
    example: 'Str0ngP@ssw0rd!',
    description: 'User password (no spaces allowed)',
  })
  @NotContains(' ')
  @IsNotEmpty()
  readonly password: string;
}
