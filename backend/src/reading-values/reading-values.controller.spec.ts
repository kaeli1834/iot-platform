import { Test, TestingModule } from '@nestjs/testing';
import { ReadingValuesController } from './reading-values.controller';
import { ReadingValuesService } from './reading-values.service';

describe('ReadingValuesController', () => {
  let controller: ReadingValuesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadingValuesController],
      providers: [ReadingValuesService],
    }).compile();

    controller = module.get<ReadingValuesController>(ReadingValuesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
