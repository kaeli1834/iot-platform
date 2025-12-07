import { Test, TestingModule } from '@nestjs/testing';
import { MetricTypesService } from './metric-types.service';

describe('MetricTypesService', () => {
  let service: MetricTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetricTypesService],
    }).compile();

    service = module.get<MetricTypesService>(MetricTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
