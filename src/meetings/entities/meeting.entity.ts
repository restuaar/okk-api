import { ApiProperty } from '@nestjs/swagger';
import { Panitia, PanitiaRapatBPH, RapatBPH } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class MeetingEntity implements RapatBPH {
  @ApiProperty()
  id: string;

  @ApiProperty()
  waktu: Date;

  @ApiProperty()
  tempat: string;

  @ApiProperty()
  kesimpulan: string;

  @ApiProperty()
  divisi_bph_id: string;

  @ApiProperty()
  panitia_hadir?: PanitiaRapatBPH[];
}

export class MeetingOrganizerEntity implements PanitiaRapatBPH {
  constructor(partial: Partial<MeetingOrganizerEntity>) {
    Object.assign(this, partial);
  }

  @Exclude()
  rapat_id: string;

  @Exclude()
  panitia_username: string;

  @ApiProperty()
  waktu_hadir: Date;

  @ApiProperty()
  panitia: Panitia;

  @Exclude()
  waktu_rapat: Date;

  @Exclude()
  divisi_bph_id: string;
}
