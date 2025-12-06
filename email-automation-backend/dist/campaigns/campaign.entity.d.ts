export declare enum CampaignStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED"
}
export declare enum ScheduleType {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY"
}
export declare class Campaign {
    id: string;
    name: string;
    status: CampaignStatus;
    scheduleType: ScheduleType;
    dailyLimit: number;
    weeklyDays: string;
    weeklyLimit: number;
    durationDays: number;
    startDate: Date;
    timeZone: string;
    aiAgentId: string;
    createdAt: Date;
    updatedAt: Date;
}
