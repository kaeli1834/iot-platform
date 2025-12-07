import { Injectable } from '@nestjs/common';
import { CreateReadingValueDto } from './dto/create-reading-value.dto';
import { UpdateReadingValueDto } from './dto/update-reading-value.dto';

@Injectable()
export class ReadingValuesService {
  create(createReadingValueDto: CreateReadingValueDto) {
    return 'This action adds a new readingValue';
  }

  findAll() {
    return `This action returns all readingValues`;
  }

  findOne(id: number) {
    return `This action returns a #${id} readingValue`;
  }

  update(id: number, updateReadingValueDto: UpdateReadingValueDto) {
    return `This action updates a #${id} readingValue`;
  }

  remove(id: number) {
    return `This action removes a #${id} readingValue`;
  }
}
