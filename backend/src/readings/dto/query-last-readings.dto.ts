import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class QueryLastReadingsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sensorId!: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  limit: number = 100;
}
