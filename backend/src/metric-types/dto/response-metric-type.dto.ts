import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseMetricTypeDto {
  @Expose()
  id: number;

  @Expose()
  typeUid: string;

  @Expose()
  description?: string;

  @Expose()
  unit: string;

  @Expose()
  createdAt: Date;
}
