import { ApiProperty } from '@nestjs/swagger';
import { Acara, AcaraPembicara, Akun, Pembicara } from '@prisma/client';

export class SpeakerEntity implements Pembicara {
  @ApiProperty()
  username: string;

  @ApiProperty()
  kontak: string;

  @ApiProperty()
  acara?: Acara[];

  @ApiProperty()
  akun?: Akun;
}

export class EventSpeakerEntity implements AcaraPembicara {
  @ApiProperty()
  id_acara: string;

  @ApiProperty()
  id_pembicara: string;

  @ApiProperty()
  acara: Acara;
}
