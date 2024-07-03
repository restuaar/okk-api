import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { createSwagger } from './config/swagger.config';
import * as cookieParser from 'cookie-parser';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  const swaggerEnabled = configService.get<boolean>('swagger.enabled');

  if (swaggerEnabled) {
    createSwagger(app);
  }

  await app.listen(port);
}
bootstrap();
