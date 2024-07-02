import { Module } from '@nestjs/common';
import { PrismaFilter } from './prisma.filter';
import { ErrorFilter } from './error.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaFilter,
    },
  ],
})
export class FilterModule {}
