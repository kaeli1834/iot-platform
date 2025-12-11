import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import * as mqtt from 'mqtt';
import {
  AggregatedPayload,
  IngestionService,
  SingleMetricPayload,
} from '../ingestion/ingestion.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttService.name);
  private client: mqtt.MqttClient;

  constructor(
    private readonly ingestionService: IngestionService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    const mqttUrl =
      this.configService.get<string>('MQTT_URL') || 'mqtt://localhost:1883';
    this.logger.log(`Attempting to connect to: ${mqttUrl}`);

    this.client = mqtt.connect(mqttUrl, {
      reconnectPeriod: 5000,
      connectTimeout: 10000,
    });

    this.client.on('connect', () => {
      this.logger.log('Connected successfully to MQTT broker');
      this.client.subscribe('iot/#', (err) => {
        if (err) {
          this.logger.error(`Subscription error: ${err.message}`);
        } else {
          this.logger.log('Subscribed to topic: iot/#');
        }
      });
    });

    this.client.on('error', (err) => {
      this.logger.error(`Connection error: ${err.message}`);
    });

    this.client.on('message', (topic, payload: Buffer) => {
      this.handleMessage(topic, payload).catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : JSON.stringify(err);
        this.logger.error(`Error processing message from ${topic}: ${message}`);
      });
    });
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.end(() => {
        this.logger.log('MQTT connection closed');
      });
    }
  }

  private async handleMessage(topic: string, payload: Buffer): Promise<void> {
    try {
      const json: unknown = JSON.parse(payload.toString());
      this.logger.debug(
        `Message on ${topic}: ${JSON.stringify(json).substring(0, 100)}`,
      );

      if (this.isValidPayload(json)) {
        await this.ingestionService.processIncomingMessage(topic, json);
      } else {
        this.logger.warn(`Invalid payload format on ${topic}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : JSON.stringify(err);
      this.logger.error(`Error parsing message: ${message}`);
    }
  }

  private isValidPayload(
    payload: unknown,
  ): payload is AggregatedPayload | SingleMetricPayload {
    if (payload === null || typeof payload !== 'object') {
      return false;
    }

    const obj = payload as Record<string, unknown>;

    const hasSensorId =
      'sensorId' in obj &&
      typeof obj['sensorId'] === 'string' &&
      obj.sensorId.length > 0;

    const hasTimestamp =
      'timestamp' in obj &&
      typeof obj['timestamp'] === 'string' &&
      !isNaN(Date.parse(obj.timestamp));

    const hasValidValueArray =
      Array.isArray(obj.values) &&
      obj.values.length > 0 &&
      obj.values.every((v) => {
        if (typeof v !== 'object' || v === null) return false;
        const item = v as Record<string, unknown>;
        return (
          'typeId' in item &&
          'value' in item &&
          (typeof item.typeId === 'string' ||
            typeof item.typeId === 'number') &&
          typeof item.value === 'number'
        );
      });

    const hasTypeIdAndValue =
      'typeId' in obj &&
      'value' in obj &&
      (typeof obj.typeId === 'string' || typeof obj.typeId === 'number') &&
      (typeof obj.value === 'number' || typeof obj.value === 'string'); // allow numeric strings

    return (
      hasSensorId && hasTimestamp && (hasValidValueArray || hasTypeIdAndValue)
    );
  }
}
