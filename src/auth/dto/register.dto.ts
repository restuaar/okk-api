import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-z0-9]+$/, {
    message:
      'username must contain only lowercase letters and numbers, without spaces or symbols',
  })
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(8, {
    message: 'password too weak, must contain at least 8 characters',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'password too weak, must contain at least 1 lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'password too weak, must contain at least 1 uppercase letter',
  })
  @Matches(/(?=.*\d)/, {
    message: 'password too weak, must contain at least 1 number',
  })
  @Matches(/(?=.*[\W_])/, {
    message: 'password too weak, must contain at least 1 symbol',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nama: string;
}
