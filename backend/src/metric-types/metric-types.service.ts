import { Injectable } from '@nestjs/common';
import { CreateMetricTypeDto } from './dto/create-metric-type.dto';
import { UpdateMetricTypeDto } from './dto/update-metric-type.dto';

@Injectable()
export class MetricTypesService {
  create(createMetricTypeDto: CreateMetricTypeDto) {
    return 'This action adds a new metricType';
  }

  findAll() {
    return `This action returns all metricTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} metricType`;
  }

  update(id: number, updateMetricTypeDto: UpdateMetricTypeDto) {
    return `This action updates a #${id} metricType`;
  }

  remove(id: number) {
    return `This action removes a #${id} metricType`;
  }
}
