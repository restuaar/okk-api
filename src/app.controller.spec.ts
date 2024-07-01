import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('AppController', () => {
    it('should return description about author', () => {
      expect(appController.main()).toBe({
        author_url: 'https://github.com/restuaar',
        version: '1.0.0',
        github_url: 'https://github.com/restuaar/okk-api',
        message: 'Welcome to OKK UI API 2024!',
      });
    });
  });
});
