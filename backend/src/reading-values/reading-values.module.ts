import { Module } from '@nestjs/common';
import { ReadingValuesService } from './reading-values.service';
import { ReadingValuesController } from './reading-values.controller';

@Module({
  controllers: [ReadingValuesController],
  providers: [ReadingValuesService],
})
export class ReadingValuesModule {}
