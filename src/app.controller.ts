import { Controller, Get } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from './dto/success.dto';
import { ErrorResponse } from './dto/error.dto';

@ApiTags('Main')
@ApiExtraModels(ErrorResponse)
@ApiExtraModels(SuccessResponse)
@Controller()
export class AppController {
  @Get()
  main() {
    return {
      author_url: 'https://github.com/restuaar',
      version: '1.0.0',
      github_url: 'https://github.com/restuaar/okk-api',
      message: 'Welcome to OKK UI API 2024!',
    };
  }
}
