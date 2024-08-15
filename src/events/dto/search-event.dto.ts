import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class SearchEventDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  nama?: string;

  @IsDateString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  waktu_mulai?: string;

  @IsDateString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  waktu_selesai?: string;

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
