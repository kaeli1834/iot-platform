import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SensorsModule } from './sensors/sensors.module';
import { MetricTypesModule } from './metric-types/metric-types.module';

@Module({
  imports: [SensorsModule, MetricTypesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
