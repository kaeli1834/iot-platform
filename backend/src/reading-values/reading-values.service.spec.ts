import { Test, TestingModule } from '@nestjs/testing';
import { ReadingValuesService } from './reading-values.service';

describe('ReadingValuesService', () => {
  let service: ReadingValuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReadingValuesService],
    }).compile();

    service = module.get<ReadingValuesService>(ReadingValuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
