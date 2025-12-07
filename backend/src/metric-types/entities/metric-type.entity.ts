import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReadingValue } from 'src/reading-values/entities/reading-value.entity';

@Entity('metric_types')
@Index(['typeUid', 'unit'], { unique: true })
export class MetricType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type_uid' })
  typeUid: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  unit: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @OneToMany(() => ReadingValue, (readingValue) => readingValue.metricType)
  readingValues: ReadingValue[];
}
