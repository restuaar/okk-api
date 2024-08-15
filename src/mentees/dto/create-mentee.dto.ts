import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateMenteeDto {
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

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  no_kelompok_okk: number;
}
