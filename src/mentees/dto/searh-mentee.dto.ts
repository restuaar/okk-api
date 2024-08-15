import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class SearchMenteeDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  nama?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  fakultas?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  jurusan?: string;

  @Min(2020)
  @Max(2024)
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  angkatan?: number;

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
