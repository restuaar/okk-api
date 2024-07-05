import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { createSwagger } from './config/swagger.config';
import * as cookieParser from 'cookie-parser';
import {
  ClassSerializerInterceptor,
  RequestMethod,
  VersioningType,
} from '@nestjs/common';
import corsConfig from './config/cors.config';
import { CustomValidationPipe } from './filter/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const cookieSecret = configService.get<string>('cookies.secret');
  const port = configService.get<number>('port');
  const swaggerEnabled = configService.get<boolean>('swagger.enabled');

  if (swaggerEnabled) {
    createSwagger(app);
  }

  app.use(cookieParser(cookieSecret));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.enableCors(corsConfig);
  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableShutdownHooks();

  await app.listen(port);
}
bootstrap();
