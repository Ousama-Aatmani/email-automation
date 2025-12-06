import { Repository } from 'typeorm';
import { Campaign } from '../campaigns/campaign.entity';
import { EmailLog } from '../campaigns/email-log.entity';
import { AiService } from '../ai/ai.service';
export declare class SchedulerService {
    private campaignsRepository;
    private emailLogRepository;
    private aiService;
    private readonly logger;
    constructor(campaignsRepository: Repository<Campaign>, emailLogRepository: Repository<EmailLog>, aiService: AiService);
    handleCron(): Promise<void>;
    private processCampaign;
    private checkSchedule;
    private countSentToday;
    private fetchNextLead;
}
