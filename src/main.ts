import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { EnvKeysEnum } from 'config/env.enum';
import { SwaggerGenerator } from 'config/swagger.generator';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env[EnvKeysEnum.SERVER_HTTP_PORT] || 4000;
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  const logger = new Logger('Main');

  app.enableVersioning({ type: VersioningType.URI });

  // Swagger
  const swaggerGenerator = new SwaggerGenerator();
  await swaggerGenerator.load(app);

  app.enableCors({ origin: '*' });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      enableDebugMessages: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(PORT, () =>
    logger.log(
      `Server running over: ${process.env[EnvKeysEnum.SERVER_HTTP_HOST]}:${PORT} on ${process.env[EnvKeysEnum.NODE_ENV]} mode`,
    ),
  );
}
bootstrap();
