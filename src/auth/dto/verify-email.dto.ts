import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { trim } from 'src/common/helpers/cast.helper';

/**
 * Data Transfer Object for verifying user email.
 * Applies trimming and lowercasing to the input email.
 */
export class VerifyEmailDto {
  /**
   * User's email address to verify. Must be a valid email format.
   */
  @ApiProperty({
    example: 'user@example.com',
    description: "User's email address to verify",
  })
  @Transform(({ value }) => trim(value).toLowerCase())
  @IsEmail()
  email: string;
}
