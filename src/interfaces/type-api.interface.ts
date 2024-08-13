import { ApiProperty } from '@nestjs/swagger';
import {
  $Enums,
  Acara,
  AcaraPembicara,
  AcaraSponsor,
  DivisiBPH,
  DivisiPI,
  KelompokOKK,
  Mentee,
  MenteeMentoring,
  Mentoring,
  Panitia,
  PanitiaRapatBPH,
  Pembicara,
  RapatBPH,
  Sponsor,
} from '@prisma/client';

export class AkunType {
  @ApiProperty()
  id: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  nama: string;
  @ApiProperty()
  created_at: Date;
}

export class PanitiaType implements Panitia {
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
  jabatan: $Enums.TipeJabatan;
}

export class DivisiPIType implements DivisiPI {
  @ApiProperty()
  id: string;
  @ApiProperty()
  nama: string;
}

export class DivisiBPHType implements DivisiBPH {
  @ApiProperty()
  id: string;
  @ApiProperty()
  nama: string;
  @ApiProperty()
  divisi_bagian: string;
}

export class RapatBPHType implements RapatBPH {
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
}

export class PanitiaRapatBPHType implements PanitiaRapatBPH {
  @ApiProperty()
  rapat_id: string;
  @ApiProperty()
  panitia_username: string;
  @ApiProperty()
  waktu_hadir: Date;
  @ApiProperty()
  waktu_rapat: Date;
  @ApiProperty()
  divisi_bph_id: string;
}

export class KelompokOKKType implements KelompokOKK {
  @ApiProperty()
  id: string;
  @ApiProperty()
  no: number;
  @ApiProperty()
  username_mentor: string;
}

export class MenteeType implements Mentee {
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

export class MentoringType implements Mentoring {
  @ApiProperty()
  waktu: Date;
  @ApiProperty()
  tempat: string;
  @ApiProperty()
  materi: string;
  @ApiProperty()
  no_kelompok: number;
}

export class MenteeMentoringType implements MenteeMentoring {
  @ApiProperty()
  mentee_username: string;
  @ApiProperty()
  waktu_hadir: Date;
  @ApiProperty()
  waktu_mentoring: Date;
  @ApiProperty()
  no_kelompok: number;
}

export class AcaraType implements Acara {
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
}

export class SponsorType implements Sponsor {
  @ApiProperty()
  username: string;
  @ApiProperty()
  kontak: string;
}

export class AcaraSponsorType implements AcaraSponsor {
  @ApiProperty()
  id_acara: string;
  @ApiProperty()
  id_sponsor: string;
  @ApiProperty()
  paket: $Enums.PaketSponsor;
}

export class PembicaraType implements Pembicara {
  @ApiProperty()
  username: string;
  @ApiProperty()
  kontak: string;
}

export class AcaraPembicaraType implements AcaraPembicara {
  @ApiProperty()
  id_acara: string;
  @ApiProperty()
  id_pembicara: string;
}
