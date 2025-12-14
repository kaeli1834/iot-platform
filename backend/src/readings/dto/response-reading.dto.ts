import { Exclude, Expose, Transform } from 'class-transformer';

@Expose()
export class ResponseReadingDto {
  @Expose()
  id: number;

  @Expose()
  @Transform(({ obj }) => obj.readingValues[0]?.value)
  value: number;

  @Expose()
  timestamp: Date;

  @Expose()
  @Transform(({ obj }) => obj.readingValues[0]?.metricType.id)
  metricTypeId: number;

  @Expose()
  @Transform(({ obj }) => obj.readingValues[0]?.metricType.typeUid)
  metricTypeUid: string;

  @Expose()
  createdAt: Date;
}
