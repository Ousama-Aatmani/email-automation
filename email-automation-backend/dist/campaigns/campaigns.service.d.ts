import { Repository } from 'typeorm';
import { Campaign, CampaignStatus } from './campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
export declare class CampaignsService {
    private campaignsRepository;
    constructor(campaignsRepository: Repository<Campaign>);
    create(createCampaignDto: CreateCampaignDto): Promise<Campaign>;
    findAll(status?: CampaignStatus, startDate?: Date, endDate?: Date): Promise<Campaign[]>;
    findOne(id: string): Promise<Campaign>;
    update(id: string, updateCampaignDto: UpdateCampaignDto): Promise<Campaign>;
    pause(id: string): Promise<Campaign>;
    resume(id: string): Promise<Campaign>;
    cancel(id: string): Promise<Campaign>;
}
