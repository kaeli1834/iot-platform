import { Injectable } from '@nestjs/common';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { Sensor } from './entities/sensor.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SensorsService {
  @InjectRepository(Sensor)
  private sensorRepository: Repository<Sensor>;

  create(createSensorDto: CreateSensorDto) {
    const sensor = this.sensorRepository.create(createSensorDto);
    return this.sensorRepository.save(sensor);
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
