import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from '../sensors/entities/sensor.entity';
import { MetricType } from 'src/metric-types/entities/metric-type.entity';
import { Reading } from 'src/readings/entities/reading.entity';
import { ReadingValue } from 'src/reading-values/entities/reading-value.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sensor, MetricType, Reading, ReadingValue]),
  ],
  providers: [IngestionService],
  exports: [IngestionService],
})
export class IngestionModule {}
