import { registerAs } from '@nestjs/config';
import {
  EnvironmentEnum,
  EnvKeysEnum,
  JwtEnums,
  SwaggerEnums,
} from './env.enum';
import { IAppConfig, IMongoConfig, ISwaggerConfig } from './interface';

export const appConfig = registerAs(
  'app',
  (): IAppConfig => ({
    NODE_ENV: process.env[EnvKeysEnum.NODE_ENV]! as EnvironmentEnum,
    SERVER_HTTP_PORT: parseInt(process.env[EnvKeysEnum.SERVER_HTTP_PORT]!, 10),
    SERVER_HTTP_HOST: process.env[EnvKeysEnum.SERVER_HTTP_HOST]!,
  }),
);

export const mongoConfig = registerAs(
  'mongo',
  (): IMongoConfig => ({
    DB_URL: process.env[EnvKeysEnum.DB_URL]!,
  }),
);

export const jwtConfig = registerAs('jwt', () => ({
  accessSecret: process.env[JwtEnums.JWT_ACCESS_SECRET],
  refreshSecret: process.env[JwtEnums.JWT_REFRESH_SECRET],
  audience: process.env[JwtEnums.JWT_TOKEN_AUDIENCE],
  issuer: process.env[JwtEnums.JWT_TOKEN_ISSUER],
  accessTokenTtl: parseInt(process.env[JwtEnums.JWT_ACCESS_TOKEN_TTL]!, 10),
  refreshTokenTtl: parseInt(process.env[JwtEnums.JWT_REFRESH_TOKEN_TTL]!, 10),
}));

export const swaggerConfig = registerAs(
  'swagger',
  (): ISwaggerConfig => ({
    SWAGGER_API: process.env[SwaggerEnums.SWAGGER_API]!,
    SWAGGER_ALLOW: process.env[SwaggerEnums.SWAGGER_ALLOW]!,
    SWAGGER_USER_NAME: process.env[SwaggerEnums.SWAGGER_USER_NAME]!,
    SWAGGER_PASSWORD: process.env[SwaggerEnums.SWAGGER_PASSWORD]!,
  }),
);
