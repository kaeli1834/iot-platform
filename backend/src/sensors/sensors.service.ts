import { Injectable } from '@nestjs/common';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Sensor } from './entities/sensor.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';

@Injectable()
export class SensorsService {
  @InjectRepository(Sensor)
  private sensorRepository: Repository<Sensor>;

  create(createSensorDto: CreateSensorDto) {
    return this.sensorRepository.create(createSensorDto);
  }

  findAll() {
    return this.sensorRepository.find();
  }

  findOne(id: number) {
    return this.sensorRepository.findOneBy({ id });
  }

  update(id: number, updateSensorDto: UpdateSensorDto) {
    return this.sensorRepository.update(id, updateSensorDto);
  }

  remove(id: number) {
    return this.sensorRepository.softDelete(id);
  }
}
