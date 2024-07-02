import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from 'env.validation';
import { FilterModule } from './filter/filter.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    FilterModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
