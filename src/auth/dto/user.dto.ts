import { ApiProperty } from '@nestjs/swagger';

export class User {
  id?: string;

  @ApiProperty()
  nama: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  createdAt: Date;
}
