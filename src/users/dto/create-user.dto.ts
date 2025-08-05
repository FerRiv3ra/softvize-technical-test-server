import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

/**
 * Data Transfer Object for creating a new user.
 * Includes validation and Swagger documentation for API schema.
 */
export class CreateUserDto {
  /**
   * User's email address. Must be a valid email format.
   */
  @ApiProperty({
    example: 'user@example.com',
    description: "User's email address",
  })
  @IsEmail()
  email: string;

  /**
   * User's password. Must be strong (min length, uppercase, lowercase, number, symbol).
   */
  @ApiProperty({
    example: 'Str0ngP@ssw0rd!',
    minLength: 8,
    description: "User's password (strong)",
  })
  @IsStrongPassword()
  password: string;

  /**
   * Username for the user. Minimum 5 characters.
   */
  @ApiProperty({
    example: 'John Doe',
    minLength: 5,
    description: 'User name (min 5 characters)',
  })
  @IsString()
  @MinLength(5)
  name: string;
}

/**
 * Data Transfer Object for updating an existing user.
 * Extends CreateUserDto to allow partial updates while maintaining validation.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  /**
   * UpdateUserDto extends CreateUserDto to allow partial updates.
   * It inherits all properties and validation rules from CreateUserDto.
   */
}
