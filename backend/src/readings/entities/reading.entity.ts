import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Sensor } from 'src/sensors/entities/sensor.entity';
import { ReadingValue } from 'src/reading-values/entities/reading-value.entity';

@Entity('readings')
export class Reading {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sensor, (sensor) => sensor.readings)
  @JoinColumn({ name: 'sensor_id' })
  sensor: Sensor;

  // The foreign key column is managed by the relation above (sensor_id)

  @Column({ name: 'timestamp', type: 'timestamptz' })
  timestamp: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @OneToMany(() => ReadingValue, (readingValue) => readingValue.reading, {
    cascade: true,
  })
  readingValues: ReadingValue[];
}
