import { CreateCampaignDto } from './create-campaign.dto';

// Since I didn't add @nestjs/mapped-types to package.json, I will just redefine or use Partial.
// Ideally I should add @nestjs/mapped-types. Let's assume I can add it or just copy props.
// For simplicity in this prototype, I'll just export a class extending Partial.

export class UpdateCampaignDto {
    // Manually optional properties for now to avoid dependency issues in this simulation
    name?: string;
    dailyLimit?: number;
    weeklyDays?: string;
    weeklyLimit?: number;
    durationDays?: number;
    startDate?: Date;
    timeZone?: string;
    aiAgentId?: string;
}
