import { PartialType } from '@nestjs/mapped-types';
import { CreateReadingValueDto } from './create-reading-value.dto';

export class UpdateReadingValueDto extends PartialType(CreateReadingValueDto) {}
