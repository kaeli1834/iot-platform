import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetricTypesService } from './metric-types.service';
import { CreateMetricTypeDto } from './dto/create-metric-type.dto';
import { UpdateMetricTypeDto } from './dto/update-metric-type.dto';

@Controller('metric-types')
export class MetricTypesController {
  constructor(private readonly metricTypesService: MetricTypesService) {}

  @Post()
  create(@Body() createMetricTypeDto: CreateMetricTypeDto) {
    return this.metricTypesService.create(createMetricTypeDto);
  }

  @Get()
  findAll() {
    return this.metricTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metricTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetricTypeDto: UpdateMetricTypeDto) {
    return this.metricTypesService.update(+id, updateMetricTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metricTypesService.remove(+id);
  }
}
