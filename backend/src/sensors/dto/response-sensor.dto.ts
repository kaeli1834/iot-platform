import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class ResponseSensorDto {
  @Expose()
  id: number;

  @Expose()
  sensorUid: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  createdAt: Date;
}
