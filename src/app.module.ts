import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import {
  appConfig,
  jwtConfig,
  mongoConfig,
  swaggerConfig,
} from 'config/server.config';
import { validate } from 'env.validation';
import { AuthModule } from './auth/auth.module';
import { ConnectionsModule } from './connections/connections.module';
import { AccessTokenGuard, AuthGuard } from './iam/guards';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, mongoConfig, jwtConfig, swaggerConfig],
      cache: true,
      isGlobal: true,
      validate,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ConnectionsModule,
  ],
  providers: [
    AccessTokenGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
