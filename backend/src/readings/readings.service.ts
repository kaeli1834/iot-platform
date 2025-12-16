import { Injectable } from '@nestjs/common';
import { Reading } from './entities/reading.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReadingsService {
  @InjectRepository(Reading)
  private readonly readingRepository: Repository<Reading>;

  async findBySensor(sensorId: number, limit: number) {
    const readings = await this.readingRepository.find({
      where: { sensor: { id: sensorId } },
      order: { timestamp: 'DESC' },
      relations: ['readingValues', 'readingValues.metricType'],
      take: limit,
    });

    return readings;
  }

  findBySensorBetweenDates(
    sensorId: number,
    startDate: Date,
    endDate: Date,
    metricTypeId: number,
  ) {
    let query = this.readingRepository
      .createQueryBuilder('reading')
      .leftJoinAndSelect('reading.readingValues', 'readingValue')
      .leftJoinAndSelect('readingValue.metricType', 'metricType')
      .where('reading.sensor.id = :sensorId', { sensorId });

    if (startDate) {
      query = query.andWhere('reading.timestamp >= :startDate', { startDate });
    }

    if (endDate) {
      query = query.andWhere('reading.timestamp <= :endDate', { endDate });
    }

    if (metricTypeId) {
      query = query.andWhere('metricType.id = :metricTypeId', { metricTypeId });
    }

    const readings = query.orderBy('reading.timestamp', 'ASC').getMany();

    return readings;
  }
}
