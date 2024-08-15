import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, Min, IsNumber } from 'class-validator';

export class SearchMentoringDto {
  @Min(0)
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  page?: number;

  @Min(0)
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  size?: number;
}
