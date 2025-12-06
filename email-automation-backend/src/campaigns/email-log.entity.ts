import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Campaign } from './campaign.entity';

export enum EmailStatus {
  PENDING_REVIEW = 'PENDING_REVIEW',
  SCHEDULED = 'SCHEDULED',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

@Entity()
export class EmailLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Campaign, (campaign) => campaign.id)
  campaign: Campaign;

  @Column()
  campaignId: string;

  @Column()
  recipientEmail: string;

  @Column('text')
  subject: string;

  @Column('text')
  content: string;

  @Column({
    type: 'simple-enum',
    enum: EmailStatus,
    default: EmailStatus.PENDING_REVIEW,
  })
  status: EmailStatus;

  @Column({ nullable: true })
  sentAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
