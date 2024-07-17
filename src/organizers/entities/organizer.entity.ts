import { ApiProperty } from '@nestjs/swagger';
import { DivisiPI, Panitia, RapatBPH, TipeJabatan } from '@prisma/client';

export class OrganizerEntity implements Panitia {
  @ApiProperty()
  username: string;
  @ApiProperty()
  fakultas: string;
  @ApiProperty()
  jurusan: string;
  @ApiProperty()
  angkatan: number;
  @ApiProperty({ nullable: true })
  divisi_pi_id: string;
  @ApiProperty({ nullable: true })
  divisi_bph_id: string;
  @ApiProperty()
  jabatan: TipeJabatan;

  @ApiProperty({ required: false })
  divisi_pi?: DivisiPI;
  @ApiProperty({ required: false })
  divisi_bph?: DivisiPI;
  @ApiProperty({ required: false })
  hadirRapat?: RapatBPH[];
}
