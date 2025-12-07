import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SensorsModule } from './sensors/sensors.module';
import { MetricTypesModule } from './metric-types/metric-types.module';
import { ReadingsModule } from './readings/readings.module';
import { ReadingValuesModule } from './reading-values/reading-values.module';

@Module({
  imports: [SensorsModule, MetricTypesModule, ReadingsModule, ReadingValuesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
