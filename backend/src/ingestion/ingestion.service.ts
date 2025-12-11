import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(IngestionService.name);
  private sensorCache = new Map<string, Sensor>();
  private metricCache = new Map<string, MetricType>();

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

    this.logger.warn(`Unknown payload format: ${JSON.stringify(payload)}`);
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

    // Batch fetch all metrics (avoid N+1)
    const typeIds = data.values.map((v) => v.typeId);
    const metrics = await this.getMetricTypesOrFail(typeIds);

    // Prepare bulk insert
    const readingValues = data.values.map((v) => {
      const metric = metrics.get(v.typeId);
      if (!metric) {
        throw new Error(`MetricType not registered: ${v.typeId}`);
      }
      return {
        reading,
        metricType: metric,
        value: v.value,
      };
    });

    // Batch insert all values at once
    await this.valueRepo.save(readingValues);

    this.logger.log(
      `Aggregated data stored - Sensor: ${data.sensorId}, Values: ${data.values.length}`,
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

    this.logger.log(
      `Single metric stored - Sensor: ${data.sensorId}, Type: ${data.typeId}`,
    );
  }

  //------------------------------------------
  // HELPERS
  //------------------------------------------
  private async getSensorOrFail(sensorId: string): Promise<Sensor> {
    // Check cache first
    if (this.sensorCache.has(sensorId)) {
      return this.sensorCache.get(sensorId)!;
    }

    const sensor = await this.sensorRepo.findOne({
      where: { sensorUid: sensorId },
    });
    if (!sensor) {
      throw new Error(`Sensor not registered: ${sensorId}`);
    }

    // Cache the result
    this.sensorCache.set(sensorId, sensor);
    return sensor;
  }

  private async getMetricTypeOrFail(typeId: string): Promise<MetricType> {
    // Check cache first
    if (this.metricCache.has(typeId)) {
      return this.metricCache.get(typeId)!;
    }

    const metric = await this.metricRepo.findOne({
      where: { typeUid: typeId },
    });
    if (!metric) {
      throw new Error(`MetricType not registered: ${typeId}`);
    }

    // Cache the result
    this.metricCache.set(typeId, metric);
    return metric;
  }

  private async getMetricTypesOrFail(
    typeIds: string[],
  ): Promise<Map<string, MetricType>> {
    const result = new Map<string, MetricType>();
    const missing: string[] = [];

    // Check cache first
    for (const id of typeIds) {
      if (this.metricCache.has(id)) {
        result.set(id, this.metricCache.get(id)!);
      } else {
        missing.push(id);
      }
    }

    // Fetch missing from DB
    if (missing.length > 0) {
      const metrics = await this.metricRepo.find({
        where: { typeUid: missing.length === 1 ? missing[0] : undefined },
      });

      // If query didn't work with IN clause, do it properly
      if (metrics.length === 0 && missing.length > 0) {
        for (const typeId of missing) {
          const metric = await this.metricRepo.findOne({
            where: { typeUid: typeId },
          });
          if (!metric) {
            throw new Error(`MetricType not registered: ${typeId}`);
          }
          result.set(typeId, metric);
          this.metricCache.set(typeId, metric);
        }
      } else {
        for (const metric of metrics) {
          result.set(metric.typeUid, metric);
          this.metricCache.set(metric.typeUid, metric);
        }
      }
    }

    return result;
  }
}
