import { ApiProperty } from '@nestjs/swagger';
import { TipeJabatan } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class SearchOrganizerDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  nama?: string;

  @IsUUID()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  divisi_id?: string;

  @IsEnum(TipeJabatan)
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ enum: TipeJabatan })
  jabatan?: TipeJabatan;

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
