import { Module } from '@nestjs/common';
import { MenteesService } from './mentees.service';
import { MenteesController } from './mentees.controller';

@Module({
  controllers: [MenteesController],
  providers: [MenteesService],
})
export class MenteesModule {}
