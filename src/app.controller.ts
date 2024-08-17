import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController()
@UseInterceptors(CacheInterceptor)
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
