import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignsModule } from './campaigns/campaigns.module';
import { AiModule } from './ai/ai.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { Campaign } from './campaigns/campaign.entity';
import { EmailLog } from './campaigns/email-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Campaign, EmailLog],
      synchronize: true, // Only for dev
    }),
    CampaignsModule,
    AiModule,
    SchedulerModule,
  ],
})
export class AppModule {}
