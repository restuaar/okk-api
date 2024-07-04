import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, string>
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: LoggerService) {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
        {
          emit: 'event',
          level: 'error',
        },
      ],
    });
  }

  async onModuleInit() {
    this.$on('info', (e) => {
      this.logger.log(e.message, e.target);
    });
    this.$on('warn', (e) => {
      this.logger.warn(e.message, e.target);
    });
    this.$on('error', (e) => {
      this.logger.error(e.message, e.target);
    });
    this.$on('query', (e) => {
      this.logger.log(JSON.stringify(e), e.target);
    });

    await this.$connect();
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from the database', 'PrismaService');

    await this.$disconnect();
  }
}
