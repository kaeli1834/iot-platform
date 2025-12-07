import { Test, TestingModule } from '@nestjs/testing';
import { MetricTypesController } from './metric-types.controller';
import { MetricTypesService } from './metric-types.service';

describe('MetricTypesController', () => {
  let controller: MetricTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricTypesController],
      providers: [MetricTypesService],
    }).compile();

    controller = module.get<MetricTypesController>(MetricTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
