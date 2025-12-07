import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReadingValuesService } from './reading-values.service';
import { CreateReadingValueDto } from './dto/create-reading-value.dto';
import { UpdateReadingValueDto } from './dto/update-reading-value.dto';

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
  findOne(@Param('id') id: string) {
    return this.readingValuesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReadingValueDto: UpdateReadingValueDto) {
    return this.readingValuesService.update(+id, updateReadingValueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.readingValuesService.remove(+id);
  }
}
