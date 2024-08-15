import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nama: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  waktu_mulai: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  waktu_selesai: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  tempat: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  deskripsi: string;
}
