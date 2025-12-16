import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSensorDto {
  @IsString()
  @IsNotEmpty()
  sensorUid: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;
}
