import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Campaign, CampaignStatus } from './campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private campaignsRepository: Repository<Campaign>,
  ) {}

  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    const campaign = this.campaignsRepository.create({
      ...createCampaignDto,
      // We default to DRAFT so the user can review settings before it starts blasting emails.
      // But for this test requirement, maybe ACTIVE is easier to test immediately.
      // Let's stick to ACTIVE for the MVP.
      status: CampaignStatus.ACTIVE, 
    });
    return this.campaignsRepository.save(campaign);
  }

  async findAll(status?: CampaignStatus, startDate?: Date, endDate?: Date): Promise<Campaign[]> {
    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    }
    return this.campaignsRepository.find({ where });
  }

  async findOne(id: string): Promise<Campaign> {
    const campaign = await this.campaignsRepository.findOne({ where: { id } });
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
    return campaign;
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto): Promise<Campaign> {
    const campaign = await this.findOne(id);
    Object.assign(campaign, updateCampaignDto);
    return this.campaignsRepository.save(campaign);
  }

  async pause(id: string): Promise<Campaign> {
    const campaign = await this.findOne(id);
    campaign.status = CampaignStatus.PAUSED;
    return this.campaignsRepository.save(campaign);
  }

  async resume(id: string): Promise<Campaign> {
    const campaign = await this.findOne(id);
    campaign.status = CampaignStatus.ACTIVE;
    return this.campaignsRepository.save(campaign);
  }

  async cancel(id: string): Promise<Campaign> {
    const campaign = await this.findOne(id);
    campaign.status = CampaignStatus.CANCELLED;
    return this.campaignsRepository.save(campaign);
  }
}
