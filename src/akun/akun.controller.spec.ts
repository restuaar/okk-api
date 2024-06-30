import { Test, TestingModule } from '@nestjs/testing';
import { AkunController } from './akun.controller';
import { AkunService } from './akun.service';

describe('AkunController', () => {
  let controller: AkunController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AkunController],
      providers: [AkunService],
    }).compile();

    controller = module.get<AkunController>(AkunController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
