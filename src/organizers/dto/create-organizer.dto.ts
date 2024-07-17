import { ApiProperty } from '@nestjs/swagger';
import { TipeJabatan } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateOrganizerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fakultas: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  jurusan: string;

  @IsNumber()
  @Min(2020)
  @Max(2024)
  @IsNotEmpty()
  @ApiProperty()
  angkatan: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  divisi_pi_id?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  divisi_bph_id?: string;

  @IsEnum(TipeJabatan)
  @IsNotEmpty()
  @ApiProperty({ enum: TipeJabatan })
  jabatan: TipeJabatan;
}
