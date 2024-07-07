import { ApiProperty } from '@nestjs/swagger';

export class Page {
  @ApiProperty()
  current_page: number;

  @ApiProperty()
  total_page: number;

  @ApiProperty()
  size: number;

  @ApiProperty()
  total_size: number;
}

export class SuccessResponse<T> {
  @ApiProperty()
  message: string;

  @ApiProperty()
  data: T;

  @ApiProperty({ nullable: true, required: false })
  page?: Page;
}
