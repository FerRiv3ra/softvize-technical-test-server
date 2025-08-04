import { Type, plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, validateSync } from 'class-validator';
import {
  EnvKeysEnum,
  EnvironmentEnum,
  JwtEnums,
  SwaggerEnums,
} from 'config/env.enum';
import {
  IAppConfig,
  IJwtConfig,
  IMongoConfig,
  ISwaggerConfig,
} from './config/interface';
import { IsNotEmptyString } from './src/common/decorators';

export class EnvironmentVariables
  implements IAppConfig, IMongoConfig, IJwtConfig, ISwaggerConfig
{
  @IsNotEmpty()
  @IsEnum(EnvironmentEnum)
  [EnvKeysEnum.NODE_ENV]!: EnvironmentEnum;

  @IsNotEmptyString()
  [EnvKeysEnum.SERVER_HTTP_HOST]!: string;

  @IsNotEmpty()
  @IsNumber()
  [EnvKeysEnum.SERVER_HTTP_PORT]!: number;

  @IsNotEmptyString()
  [EnvKeysEnum.DB_URL]!: string;

  @IsNotEmptyString()
  @Type(() => String)
  [JwtEnums.JWT_ACCESS_SECRET]!: string;

  @IsNotEmptyString()
  @Type(() => String)
  [JwtEnums.JWT_REFRESH_SECRET]!: string;

  @IsNumber()
  [JwtEnums.JWT_ACCESS_TOKEN_TTL]!: number;

  @IsNumber()
  [JwtEnums.JWT_REFRESH_TOKEN_TTL]!: number;

  @IsNotEmptyString()
  @Type(() => String)
  [JwtEnums.JWT_TOKEN_AUDIENCE]!: string;

  @IsNotEmptyString()
  @Type(() => String)
  [JwtEnums.JWT_TOKEN_ISSUER]!: string;

  @IsNotEmptyString()
  @Type(() => String)
  [SwaggerEnums.SWAGGER_API]!: string;

  @IsNotEmptyString()
  @Type(() => String)
  [SwaggerEnums.SWAGGER_ALLOW]!: string;

  @IsNotEmptyString()
  @Type(() => String)
  [SwaggerEnums.SWAGGER_USER_NAME]!: string;

  @IsNotEmptyString()
  @Type(() => String)
  [SwaggerEnums.SWAGGER_PASSWORD]!: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
