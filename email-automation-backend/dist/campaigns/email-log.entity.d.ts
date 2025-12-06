import { Campaign } from './campaign.entity';
export declare enum EmailStatus {
    PENDING_REVIEW = "PENDING_REVIEW",
    SCHEDULED = "SCHEDULED",
    SENT = "SENT",
    FAILED = "FAILED"
}
export declare class EmailLog {
    id: string;
    campaign: Campaign;
    campaignId: string;
    recipientEmail: string;
    subject: string;
    content: string;
    status: EmailStatus;
    sentAt: Date;
    createdAt: Date;
}
