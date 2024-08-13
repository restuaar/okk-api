import { ApiProperty } from '@nestjs/swagger';
import { DivisiBPH, DivisiPI, Panitia, RapatBPH } from '@prisma/client';
import {
  DivisiBPHType,
  PanitiaType,
  RapatBPHType,
} from 'src/interfaces/type-api.interface';

export class DivisionPIEntity implements DivisiPI {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nama: string;

  @ApiProperty({ required: false, type: () => PanitiaType })
  pengurus?: Panitia;

  @ApiProperty({
    isArray: true,
    required: false,
    type: () => DivisiBPHType,
  })
  divisiKoor?: DivisiBPH[];
}

export class DivisionBPHEntity implements DivisiBPH {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nama: string;

  @ApiProperty()
  divisi_bagian: string;

  @ApiProperty({ required: false, nullable: true })
  divisi_pi?: DivisionPIEntity;

  @ApiProperty({
    isArray: true,
    required: false,
    type: () => PanitiaType,
  })
  panitia?: Panitia[];

  @ApiProperty({
    isArray: true,
    required: false,
    type: () => RapatBPHType,
  })
  rapat?: RapatBPH[];
}
