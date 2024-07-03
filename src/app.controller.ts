import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

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
}
