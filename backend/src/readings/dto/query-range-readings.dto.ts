import { Type } from 'class-transformer';
import { IsDate, IsInt, Min } from 'class-validator';

export class QueryRangeReadingsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sensorId!: number;

  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @Type(() => Date)
  @IsDate()
  endDate!: Date;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  metricTypeId!: number;
}
