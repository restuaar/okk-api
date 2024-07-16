import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePIDivisionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nama: string;
}
export class CreateBPHDivisionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nama: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  divisi_bagian: string;
}
