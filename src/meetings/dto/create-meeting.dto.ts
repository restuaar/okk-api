import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMeetingDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  waktu: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  tempat: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  kesimpulan: string;
}
