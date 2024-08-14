import { ApiProperty } from '@nestjs/swagger';
import { KelompokOKK, Mentee, Mentoring, Panitia } from '@prisma/client';

export class GroupEntity implements KelompokOKK {
  @ApiProperty()
  id: string;

  @ApiProperty()
  no: number;

  @ApiProperty()
  username_mentor: string;

  @ApiProperty()
  mentor?: Panitia;

  @ApiProperty()
  anggota?: Mentee[];

  @ApiProperty()
  mentoring?: Mentoring[];
}
