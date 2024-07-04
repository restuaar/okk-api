import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty()
  access_token: string;

  refresh_token?: string;
}
