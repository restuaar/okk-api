import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse<T> {
  @ApiProperty()
  message: string;

  @ApiProperty()
  data: T;
}
