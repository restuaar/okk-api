import { ApiProperty } from '@nestjs/swagger';
import { Akun, Mentee, Panitia, Pembicara, Sponsor } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { Role, TypeUser } from 'src/interfaces/auth.interface';

export class UserEntity implements Akun {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  nama: string;

  @ApiProperty()
  username: string;

  @Exclude()
  password: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  role: Role;

  @ApiProperty({ required: false })
  panitia?: Panitia;

  @ApiProperty({ required: false })
  sponsor?: Sponsor;

  @ApiProperty({ required: false })
  pembicara?: Pembicara;

  @ApiProperty({ required: false })
  mentee?: Mentee;

  @Exclude()
  type?: TypeUser;
}
