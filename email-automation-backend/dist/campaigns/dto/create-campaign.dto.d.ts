import { ScheduleType } from '../campaign.entity';
export declare class CreateCampaignDto {
    name: string;
    scheduleType: ScheduleType;
    dailyLimit?: number;
    weeklyDays?: string;
    weeklyLimit?: number;
    durationDays: number;
    startDate: Date;
    timeZone: string;
    aiAgentId: string;
}
