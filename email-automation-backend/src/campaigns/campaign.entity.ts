import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum ScheduleType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
}

@Entity()
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'simple-enum',
    enum: CampaignStatus,
    default: CampaignStatus.DRAFT,
  })
  status: CampaignStatus;

  @Column({
    type: 'simple-enum',
    enum: ScheduleType,
    default: ScheduleType.DAILY,
  })
  scheduleType: ScheduleType;

  // Daily specific: emails per day
  @Column({ nullable: true, default: 2 })
  dailyLimit: number;

  // Weekly specific: days of week (e.g., "MON,WED,FRI")
  @Column({ nullable: true })
  weeklyDays: string; // Comma separated string

  // Weekly specific: emails per selected day
  @Column({ nullable: true, default: 5 })
  weeklyLimit: number;

  @Column()
  durationDays: number;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column()
  timeZone: string;

  @Column()
  aiAgentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
