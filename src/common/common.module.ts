import { Global, Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ThrottlerModule.forRoot([
      {
        ttl: 6000,
        limit: 10,
      },
    ]),
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
        ttl: 5 * 1000,
        max: 10,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [LoggerModule, DatabaseModule, CacheModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class CommonModule {}
