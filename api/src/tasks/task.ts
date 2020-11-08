import { Exclude } from 'class-transformer';
import { CronJob } from 'cron';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Recipient } from '../recipients/recipient';

export interface ScheduledTask {
  task: Task;
  job: CronJob;
}

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  cronTime: string;

  @Column()
  cronTimezone: string;

  @Column({ default: 1 })
  dayOffset: number;

  @Column()
  notifyOnError: boolean;

  @Column()
  @Exclude()
  userId: string;

  @OneToMany(() => Recipient, recipient => recipient.task)
  recipients: Recipient[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
