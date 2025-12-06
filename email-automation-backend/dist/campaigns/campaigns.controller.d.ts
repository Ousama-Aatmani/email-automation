import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignStatus } from './campaign.entity';
export declare class CampaignsController {
    private readonly campaignsService;
    constructor(campaignsService: CampaignsService);
    create(createCampaignDto: CreateCampaignDto): Promise<import("./campaign.entity").Campaign>;
    findAll(status?: CampaignStatus, startDate?: string, endDate?: string): Promise<import("./campaign.entity").Campaign[]>;
    findOne(id: string): Promise<import("./campaign.entity").Campaign>;
    update(id: string, updateCampaignDto: UpdateCampaignDto): Promise<import("./campaign.entity").Campaign>;
    pause(id: string): Promise<import("./campaign.entity").Campaign>;
    resume(id: string): Promise<import("./campaign.entity").Campaign>;
    cancel(id: string): Promise<import("./campaign.entity").Campaign>;
}
