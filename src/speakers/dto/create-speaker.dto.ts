import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateSpeakerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsPhoneNumber()
  kontak: string;
}

export class CreateEventSpeakerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id_acara: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id_pembicara: string;
}
