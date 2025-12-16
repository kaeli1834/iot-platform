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
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { ResponseSensorDto } from './dto/response-sensor.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { IdParamDto } from '../common/dto/id-param.dto';

@Controller('sensors')
@UseInterceptors(new TransformInterceptor(ResponseSensorDto))
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Post()
  create(@Body() createSensorDto: CreateSensorDto) {
    return this.sensorsService.create(createSensorDto);
  }

  @Get()
  findAll() {
    return this.sensorsService.findAll();
  }

  @Get(':id')
  findOne(@Param() param: IdParamDto) {
    return this.sensorsService.findOne(param.id);
  }

  @Patch(':id')
  update(@Param() param: IdParamDto, @Body() updateSensorDto: UpdateSensorDto) {
    return this.sensorsService.update(param.id, updateSensorDto);
  }

  @Delete(':id')
  remove(@Param() param: IdParamDto) {
    return this.sensorsService.remove(param.id);
  }
}
