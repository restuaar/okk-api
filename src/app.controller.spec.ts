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
      const description = appController.main();
      expect(description.author_url).toBe('https://github.com/restuaar');
      expect(description.version).toBe('1.0.0');
      expect(description.github_url).toBe(
        'https://github.com/restuaar/okk-api',
      );
      expect(description.message).toBe('Welcome to OKK UI API 2024!');
    });
  });
});
