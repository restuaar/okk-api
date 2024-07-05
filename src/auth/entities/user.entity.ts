import { ApiProperty } from '@nestjs/swagger';
import { Akun } from '@prisma/client';
import { Exclude } from 'class-transformer';

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
  password: string | undefined;

  @ApiProperty()
  createdAt: Date;
}
