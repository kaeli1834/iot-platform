import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { MetricTypesService } from './metric-types.service';
import { CreateMetricTypeDto } from './dto/create-metric-type.dto';
import { UpdateMetricTypeDto } from './dto/update-metric-type.dto';
import { ResponseMetricTypeDto } from './dto/response-metric-type.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { IdParamDto } from '../common/dto/id-param.dto';

@Controller('metric-types')
@UseInterceptors(new TransformInterceptor(ResponseMetricTypeDto))
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
  findOne(@Param() param: IdParamDto) {
    return this.metricTypesService.findOne(param.id);
  }

  @Patch(':id')
  update(
    @Param() param: IdParamDto,
    @Body() updateMetricTypeDto: UpdateMetricTypeDto,
  ) {
    return this.metricTypesService.update(param.id, updateMetricTypeDto);
  }

  @Delete(':id')
  remove(@Param() param: IdParamDto) {
    return this.metricTypesService.remove(param.id);
  }
}
