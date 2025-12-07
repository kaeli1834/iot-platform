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
import { Reading } from 'src/readings/entities/reading.entity';

@Entity('sensors')
@Index(['sensorUid'], { unique: true })
export class Sensor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sensor_uid', unique: true })
  sensorUid: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  location?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @OneToMany(() => Reading, (reading) => reading.sensor)
  readings: Reading[];
}
