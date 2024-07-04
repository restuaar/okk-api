import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty()
  status: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  report_url: string;
}
