import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { IngestionModule } from '../ingestion/ingestion.module';

@Module({
  imports: [IngestionModule],
  providers: [MqttService],
})
export class MqttModule {}
