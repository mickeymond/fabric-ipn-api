import { Test, TestingModule } from '@nestjs/testing';
import { CopyrightsController } from './copyrights.controller';
import { SharedModule } from '../../shared/shared.module';

describe('Copyrights Controller', () => {
  let controller: CopyrightsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [CopyrightsController],
    }).compile();

    controller = module.get<CopyrightsController>(CopyrightsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
