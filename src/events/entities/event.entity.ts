import { ApiProperty } from '@nestjs/swagger';
import { Acara, Pembicara, Sponsor } from '@prisma/client';

export class EventEntity implements Acara {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nama: string;

  @ApiProperty()
  waktu_mulai: Date;

  @ApiProperty()
  waktu_selesai: Date;

  @ApiProperty()
  tempat: string;

  @ApiProperty()
  deskripsi: string;

  @ApiProperty()
  sponsor?: Sponsor[];

  @ApiProperty()
  pembicara?: Pembicara[];
}
