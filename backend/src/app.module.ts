import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SensorsModule } from './sensors/sensors.module';
import { MetricTypesModule } from './metric-types/metric-types.module';
import { ReadingsModule } from './readings/readings.module';

@Module({
  imports: [SensorsModule, MetricTypesModule, ReadingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
