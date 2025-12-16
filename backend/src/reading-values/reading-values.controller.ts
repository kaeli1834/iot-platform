import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReadingValuesService } from './reading-values.service';
import { CreateReadingValueDto } from './dto/create-reading-value.dto';
import { UpdateReadingValueDto } from './dto/update-reading-value.dto';
import { IdParamDto } from '../common/dto/id-param.dto';

@Controller('reading-values')
export class ReadingValuesController {
  constructor(private readonly readingValuesService: ReadingValuesService) {}

  @Post()
  create(@Body() createReadingValueDto: CreateReadingValueDto) {
    return this.readingValuesService.create(createReadingValueDto);
  }

  @Get()
  findAll() {
    return this.readingValuesService.findAll();
  }

  @Get(':id')
  findOne(@Param() param: IdParamDto) {
    return this.readingValuesService.findOne(param.id);
  }

  @Patch(':id')
  update(
    @Param() param: IdParamDto,
    @Body() updateReadingValueDto: UpdateReadingValueDto,
  ) {
    return this.readingValuesService.update(param.id, updateReadingValueDto);
  }

  @Delete(':id')
  remove(@Param() param: IdParamDto) {
    return this.readingValuesService.remove(param.id);
  }
}
