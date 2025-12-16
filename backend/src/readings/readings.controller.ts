import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ReadingsService } from './readings.service';
import { ResponseReadingDto } from './dto/response-reading.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { QueryLastReadingsDto } from './dto/query-last-readings.dto';
import { QueryRangeReadingsDto } from './dto/query-range-readings.dto';

@Controller('readings')
@UseInterceptors(new TransformInterceptor(ResponseReadingDto))
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  // get lasts 100 readings for a sensor
  @Get('lasts')
  findBySensor(@Query() query: QueryLastReadingsDto) {
    return this.readingsService.findBySensor(query.sensorId, query.limit);
  }

  // get readings for a sensor between two dates and metric
  @Get('range')
  findBySensorBetweenDates(@Query() query: QueryRangeReadingsDto) {
    return this.readingsService.findBySensorBetweenDates(
      query.sensorId,
      query.startDate,
      query.endDate,
      query.metricTypeId,
    );
  }
}
