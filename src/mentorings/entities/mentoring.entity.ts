import { ApiProperty } from '@nestjs/swagger';
import {
  KelompokOKK,
  Mentee,
  MenteeMentoring,
  Mentoring,
} from '@prisma/client';
import { Exclude } from 'class-transformer';

export class MentoringEntity implements Mentoring {
  constructor(partial: Partial<MentoringEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  waktu: Date;

  @ApiProperty()
  tempat: string;

  @ApiProperty()
  materi: string;

  @Exclude()
  no_kelompok: number;

  @ApiProperty()
  mentee_hadir: MentoringMenteeEntity[];

  @ApiProperty()
  kelompok_okk: KelompokOKK;
}

export class MentoringMenteeEntity implements MenteeMentoring {
  constructor(partial: Partial<MentoringMenteeEntity>) {
    Object.assign(this, partial);
  }

  @Exclude()
  mentoring_id: string;

  @ApiProperty()
  waktu_hadir: Date;

  @Exclude()
  mentee_username: string;

  @ApiProperty()
  waktu_mentoring: Date;

  @Exclude()
  no_kelompok: number;

  @ApiProperty()
  mentee: Mentee;

  @Exclude()
  mentoring: Mentoring;
}
