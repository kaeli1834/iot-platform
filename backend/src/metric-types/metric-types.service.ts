import { Injectable } from '@nestjs/common';
import { CreateMetricTypeDto } from './dto/create-metric-type.dto';
import { UpdateMetricTypeDto } from './dto/update-metric-type.dto';
import { MetricType } from './entities/metric-type.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MetricTypesService {
  @InjectRepository(MetricType)
  private readonly metricTypeRepository: Repository<MetricType>;

  create(createMetricTypeDto: CreateMetricTypeDto) {
    return this.metricTypeRepository.create(createMetricTypeDto);
  }

  findAll() {
    return this.metricTypeRepository.find();
  }

  findOne(id: number) {
    return this.metricTypeRepository.findOneBy({ id });
  }

  update(id: number, updateMetricTypeDto: UpdateMetricTypeDto) {
    return this.metricTypeRepository.update(id, updateMetricTypeDto);
  }

  remove(id: number) {
    return this.metricTypeRepository.softDelete(id);
  }
}
