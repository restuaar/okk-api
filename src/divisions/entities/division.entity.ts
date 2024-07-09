import { ApiProperty } from '@nestjs/swagger';
import { DivisiBPH, DivisiPI, Panitia, RapatBPH } from '@prisma/client';

export class DivisionBPH implements DivisiBPH {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nama: string;

  @ApiProperty()
  divisi_bagian: string;

  @ApiProperty()
  divisi_pi: DivisionPI;

  @ApiProperty()
  panitia: Panitia[];

  @ApiProperty()
  rapat: RapatBPH[];
}

export class DivisionPI implements DivisiPI {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nama: string;

  @ApiProperty()
  pengurus: Panitia;

  @ApiProperty()
  divisiKoor: DivisionBPH[];
}
