import { ApiProperty } from '@nestjs/swagger';
import { PaketSponsor } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateSponsorDto {
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

export class CreateEventSponsorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id_acara: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id_sponsor: string;

  @IsEnum(PaketSponsor)
  @IsNotEmpty()
  @ApiProperty()
  paket: PaketSponsor;
}
