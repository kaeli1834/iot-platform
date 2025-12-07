import { Module } from '@nestjs/common';
import { MetricTypesService } from './metric-types.service';
import { MetricTypesController } from './metric-types.controller';

@Module({
  controllers: [MetricTypesController],
  providers: [MetricTypesService],
})
export class MetricTypesModule {}
