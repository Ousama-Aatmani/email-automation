import { IsString, IsEnum, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ScheduleType } from '../campaign.entity';

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsEnum(ScheduleType)
  scheduleType: ScheduleType;

  @IsNumber()
  @IsOptional()
  dailyLimit?: number;

  @IsString()
  @IsOptional()
  weeklyDays?: string;

  @IsNumber()
  @IsOptional()
  weeklyLimit?: number;

  @IsNumber()
  durationDays: number;

  @IsDateString()
  startDate: Date;

  @IsString()
  timeZone: string;

  @IsString()
  aiAgentId: string;
}
