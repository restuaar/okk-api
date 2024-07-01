import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { createSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  const swaggerEnabled = configService.get<boolean>('swagger.enabled');

  if (swaggerEnabled) {
    createSwagger(app);
  }

  await app.listen(port);
}
bootstrap();
