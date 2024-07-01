import {
  All,
  Controller,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@ApiTags('Main')
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

  @All()
  @ApiExcludeEndpoint()
  notAllowed() {
    return new HttpException(
      'Method Not Allowed. Please use GET method instead.',
      HttpStatus.METHOD_NOT_ALLOWED,
    );
  }
}
