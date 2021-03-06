import { Test, TestingModule } from '@nestjs/testing';
import { CopyrightsResolver } from './copyrights.resolver';
import { SharedModule } from '../../shared/shared.module';

describe('CopyrightsResolver', () => {
  let resolver: CopyrightsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [CopyrightsResolver],
    }).compile();

    resolver = module.get<CopyrightsResolver>(CopyrightsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
