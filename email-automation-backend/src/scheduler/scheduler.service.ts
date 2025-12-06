import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Campaign, CampaignStatus, ScheduleType } from '../campaigns/campaign.entity';
import { EmailLog, EmailStatus } from '../campaigns/email-log.entity';
import { AiService } from '../ai/ai.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectRepository(Campaign)
    private campaignsRepository: Repository<Campaign>,
    @InjectRepository(EmailLog)
    private emailLogRepository: Repository<EmailLog>,
    private aiService: AiService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('Starting cron job: Processing active campaigns...');
    const start = Date.now();

    const activeCampaigns = await this.campaignsRepository.find({
      where: { status: CampaignStatus.ACTIVE },
    });

    this.logger.debug(`Found ${activeCampaigns.length} active campaigns.`);

    for (const campaign of activeCampaigns) {
      try {
        await this.processCampaign(campaign);
      } catch (error) {
        this.logger.error(`Failed to process campaign ${campaign.id}`, error.stack);
        // TODO: Add alert mechanism here (Slack/Email) for failed campaign processing
      }
    }
    
    const duration = Date.now() - start;
    this.logger.debug(`Cron job finished in ${duration}ms`);
  }

  private async processCampaign(campaign: Campaign) {
    const now = new Date();
    
    // 1. Check Duration
    const endDate = new Date(campaign.startDate);
    endDate.setDate(endDate.getDate() + campaign.durationDays);
    if (now > endDate) {
      this.logger.log(`Campaign ${campaign.id} expired. Marking completed.`);
      campaign.status = CampaignStatus.COMPLETED;
      await this.campaignsRepository.save(campaign);
      return;
    }

    // 2. Check Schedule
    // Note: Timezone handling assumes server time aligns with campaign schedule.
    // Future improvement: Project 'now' into the campaign's timezone.
    
    const isScheduledToday = this.checkSchedule(campaign, now);
    if (!isScheduledToday) return;

    // 3. Check Limits (Idempotency/Quotas)
    const sentToday = await this.countSentToday(campaign);
    const limit = campaign.scheduleType === ScheduleType.DAILY ? campaign.dailyLimit : campaign.weeklyLimit;

    if (sentToday >= limit) {
      this.logger.debug(`Campaign ${campaign.id} reached daily limit.`);
      return;
    }

    // 4. Fetch Leads
    // Fetch the next eligible lead for this campaign.
    const lead = this.fetchNextLead(); 

    // Check if already sent to this lead (Idempotency)
    const alreadySent = await this.emailLogRepository.findOne({
      where: { campaignId: campaign.id, recipientEmail: lead.email }
    });
    if (alreadySent) return;

    // 5. Generate Content
    const content = await this.aiService.generateEmailContent(campaign.aiAgentId, lead);

    // 6. Store/Send
    // Currently configured to auto-send. 
    // Can be modified to set status to PENDING_REVIEW for manual approval.
    const emailLog = this.emailLogRepository.create({
      campaign,
      campaignId: campaign.id,
      recipientEmail: lead.email,
      subject: content.subject,
      content: content.content,
      status: EmailStatus.SENT, // Or PENDING_REVIEW
      sentAt: new Date(),
    });

    await this.emailLogRepository.save(emailLog);
    this.logger.log(`Sent email for campaign ${campaign.id} to ${lead.email}`);
  }

  private checkSchedule(campaign: Campaign, date: Date): boolean {
    if (campaign.scheduleType === ScheduleType.DAILY) return true;
    
    if (campaign.scheduleType === ScheduleType.WEEKLY) {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(); // MON, TUE...
      // campaign.weeklyDays is "MON,WED,FRI"
      return campaign.weeklyDays?.includes(dayName) || false;
    }
    return false;
  }

  private async countSentToday(campaign: Campaign): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    
    return this.emailLogRepository.count({
      where: {
        campaignId: campaign.id,
        sentAt: MoreThan(startOfDay),
      }
    });
  }

  private fetchNextLead() {
    return { 
      email: `test-${Date.now()}@example.com`,
      name: 'Test Lead', 
      companyName: 'Test Corp' 
    };
  }
}
