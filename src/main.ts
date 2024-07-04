import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { createSwagger } from './config/swagger.config';
import * as cookieParser from 'cookie-parser';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import corsConfig from './config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const cookieSecret = configService.get<string>('cookies.secret');
  const port = configService.get<number>('port');
  const swaggerEnabled = configService.get<boolean>('swagger.enabled');

  app.use(cookieParser(cookieSecret));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.enableCors(corsConfig);
  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  if (swaggerEnabled) {
    createSwagger(app);
  }

  app.enableShutdownHooks();

  await app.listen(port);
}
bootstrap();
