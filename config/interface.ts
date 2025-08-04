import { EnvironmentEnum } from './env.enum';

export interface IAppConfig {
  SERVER_HTTP_HOST: string;
  SERVER_HTTP_PORT: number;
  NODE_ENV: EnvironmentEnum;
}

export interface IMongoConfig {
  DB_URL: string;
}

export interface IJwtConfig {
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_TOKEN_AUDIENCE: string;
  JWT_TOKEN_ISSUER: string;
  JWT_ACCESS_TOKEN_TTL: number;
  JWT_REFRESH_TOKEN_TTL: number;
}

export interface ISwaggerConfig {
  SWAGGER_API: string;
  SWAGGER_USER_NAME: string;
  SWAGGER_ALLOW: string;
  SWAGGER_PASSWORD: string;
}
