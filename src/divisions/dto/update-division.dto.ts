import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  CreatePIDivisionDto,
  CreateBPHDivisionDto,
} from './create-division.dto';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UpdateDivisionPIDto extends PartialType(CreatePIDivisionDto) {
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ required: false })
  username_pengurus?: string;
}
export class UpdateDivisionBPHDto extends PartialType(CreateBPHDivisionDto) {}
