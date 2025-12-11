import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';
import {
  AggregatedPayload,
  IngestionService,
  SingleMetricPayload,
} from '../ingestion/ingestion.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MqttService implements OnModuleInit {
  constructor(
    private readonly ingestionService: IngestionService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    const mqttUrl =
      this.configService.get<string>('MQTT_URL') || 'mqtt://localhost:1883';
    console.log('[MQTT] Attempting to connect to:', mqttUrl);

    const client = mqtt.connect(mqttUrl);

    client.on('connect', () => {
      console.log('[MQTT] Connected successfully');
      client.subscribe('iot/#', (err) => {
        if (err) {
          console.error('[MQTT] Subscription error:', err);
        } else {
          console.log('[MQTT] Subscribed to topic: iot/#');
        }
      });
    });

    client.on('error', (err) => {
      console.error('[MQTT] Connection error:', err);
    });

    client.on('message', (topic, payload: Buffer) => {
      try {
        const json: unknown = JSON.parse(payload.toString());

        if (this.isValidPayload(json)) {
          this.ingestionService
            .processIncomingMessage(topic, json)
            .catch((err) => {
              console.error('[MQTT] Error processing message:', err);
            });
        }
      } catch (err) {
        console.error('[MQTT] Error parsing message:', err);
      }
    });
  }

  private isValidPayload(
    payload: unknown,
  ): payload is AggregatedPayload | SingleMetricPayload {
    return payload !== null && typeof payload === 'object';
  }
}
