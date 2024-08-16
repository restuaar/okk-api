import { ApiProperty } from '@nestjs/swagger';
import {
  Acara,
  AcaraSponsor,
  Akun,
  PaketSponsor,
  Sponsor,
} from '@prisma/client';

export class SponsorEntity implements Sponsor {
  @ApiProperty()
  username: string;

  @ApiProperty()
  kontak: string;

  @ApiProperty()
  acara?: Acara[];

  @ApiProperty()
  akun?: Akun;
}

export class EventSponsorEntity implements AcaraSponsor {
  @ApiProperty()
  id_acara: string;

  @ApiProperty()
  id_sponsor: string;

  @ApiProperty()
  paket: PaketSponsor;

  @ApiProperty()
  acara: Acara;
}
