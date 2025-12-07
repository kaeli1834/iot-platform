import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricTypesService } from './metric-types.service';
import { MetricTypesController } from './metric-types.controller';
import { MetricType } from './entities/metric-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MetricType])],
  controllers: [MetricTypesController],
  providers: [MetricTypesService],
})
export class MetricTypesModule {}
