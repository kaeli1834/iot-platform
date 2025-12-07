import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingValuesService } from './reading-values.service';
import { ReadingValuesController } from './reading-values.controller';
import { ReadingValue } from './entities/reading-value.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReadingValue])],
  controllers: [ReadingValuesController],
  providers: [ReadingValuesService],
})
export class ReadingValuesModule {}
