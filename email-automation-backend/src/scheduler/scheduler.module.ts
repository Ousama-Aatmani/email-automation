import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { Campaign } from '../campaigns/campaign.entity';
import { EmailLog } from '../campaigns/email-log.entity';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign, EmailLog]),
    NestScheduleModule.forRoot(),
    AiModule,
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}
