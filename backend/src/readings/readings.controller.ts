import { Controller, Get } from '@nestjs/common';
import { ReadingsService } from './readings.service';
import { ResponseReadingDto } from './dto/response-reading.dto';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { Query, UseInterceptors } from '@nestjs/common/decorators';

@Controller('readings')
@UseInterceptors(new TransformInterceptor(ResponseReadingDto))
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  // get lasts 100 readings for a sensor
  @Get('lasts')
  findBySensor(
    @Query('sensorId') sensorId: string,
    @Query('limit') limit: string = '100',
  ) {
    return this.readingsService.findBySensor(+sensorId, +limit);
  }

  // get readings for a sensor between two dates and metric
  @Get('range')
  findBySensorBetweenDates(
    @Query('sensorId') sensorId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('metricTypeId') metricTypeId: string,
  ) {
    return this.readingsService.findBySensorBetweenDates(
      +sensorId,
      new Date(startDate),
      new Date(endDate),
      +metricTypeId,
    );
  }
}
