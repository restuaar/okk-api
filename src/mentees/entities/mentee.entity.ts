import { ApiProperty } from '@nestjs/swagger';
import { Mentee } from '@prisma/client';

export class MenteeEntity implements Mentee {
  @ApiProperty()
  username: string;

  @ApiProperty()
  fakultas: string;

  @ApiProperty()
  jurusan: string;

  @ApiProperty()
  angkatan: number;

  @ApiProperty()
  no_kelompok_okk: number;
}
