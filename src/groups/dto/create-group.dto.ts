import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateGroupDto {
  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  no: number;

  @IsNotEmpty()
  @IsNotEmpty()
  @ApiProperty()
  username_mentor: string;
}
