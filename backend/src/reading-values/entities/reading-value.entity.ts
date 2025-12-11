import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MetricType } from 'src/metric-types/entities/metric-type.entity';
import { Reading } from 'src/readings/entities/reading.entity';

@Entity('reading_values')
@Index(['reading', 'metricType'], { unique: true })
export class ReadingValue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Reading, (reading) => reading.readingValues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reading_id' })
  reading: Reading;

  @ManyToOne(() => MetricType, (metricType) => metricType.readingValues)
  @JoinColumn({ name: 'metric_type_id' })
  metricType: MetricType;

  @Column({ type: 'double precision' })
  value: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
