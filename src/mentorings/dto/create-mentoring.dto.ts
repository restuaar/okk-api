import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMentoringDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  waktu: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty()
  tempat: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  materi: string;
}
