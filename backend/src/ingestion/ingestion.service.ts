import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from '../sensors/entities/sensor.entity';
import { MetricType } from 'src/metric-types/entities/metric-type.entity';
import { Reading } from 'src/readings/entities/reading.entity';
import { ReadingValue } from 'src/reading-values/entities/reading-value.entity';

export interface AggregatedPayload {
  sensorId: string;
  timestamp: string;
  values: { typeId: string; value: number }[];
}

export interface SingleMetricPayload {
  sensorId: string;
  timestamp: string;
  typeId: string;
  value: number;
}

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(Sensor) private readonly sensorRepo: Repository<Sensor>,
    @InjectRepository(Reading)
    private readonly readingRepo: Repository<Reading>,
    @InjectRepository(MetricType)
    private readonly metricRepo: Repository<MetricType>,
    @InjectRepository(ReadingValue)
    private readonly valueRepo: Repository<ReadingValue>,
  ) {}

  async processIncomingMessage(
    topic: string,
    payload: AggregatedPayload | SingleMetricPayload,
  ) {
    // Detect format A (aggregated)
    if ('values' in payload && Array.isArray(payload.values)) {
      return this.saveAggregated(payload);
    }

    // Detect format B (single metric)
    if ('typeId' in payload && 'value' in payload) {
      return this.saveSingleMetric(payload);
    }

    console.warn('[Ingestion] Unknown payload format:', payload);
  }

  //------------------------------------------
  // FORMAT A : aggregated { sensorId, values[] }
  //------------------------------------------
  private async saveAggregated(data: AggregatedPayload) {
    const sensor = await this.getSensorOrFail(data.sensorId);

    const reading = await this.readingRepo.save({
      sensor,
      timestamp: new Date(data.timestamp),
    });

    for (const v of data.values) {
      const metric = await this.getMetricTypeOrFail(v.typeId);

      await this.valueRepo.save({
        reading,
        metricType: metric,
        value: v.value,
      });
    }

    console.log(
      '[Ingestion] Aggregated stored for registered sensor:',
      data.sensorId,
    );
  }

  //------------------------------------------
  // FORMAT B : single metric
  //------------------------------------------
  private async saveSingleMetric(data: SingleMetricPayload) {
    const sensor = await this.getSensorOrFail(data.sensorId);
    const metric = await this.getMetricTypeOrFail(data.typeId);

    const reading = await this.readingRepo.save({
      sensor,
      timestamp: new Date(data.timestamp),
    });

    await this.valueRepo.save({
      reading,
      metricType: metric,
      value: data.value,
    });

    console.log(
      '[Ingestion] Metric stored for registered sensor:',
      data.sensorId,
    );
  }

  //------------------------------------------
  // HELPERS
  //------------------------------------------
  private async getSensorOrFail(sensorId: string) {
    const sensor = await this.sensorRepo.findOne({
      where: { sensorUid: sensorId },
    });
    if (!sensor) {
      throw new Error(`Sensor not registered: ${sensorId}`);
    }
    return sensor;
  }

  private async getMetricTypeOrFail(typeId: string) {
    const metric = await this.metricRepo.findOne({
      where: { typeUid: typeId },
    });
    if (!metric) {
      throw new Error(`MetricType not registered: ${typeId}`);
    }
    return metric;
  }
}
