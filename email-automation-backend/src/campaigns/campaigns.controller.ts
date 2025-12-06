import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignStatus } from './campaign.entity';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignsService.create(createCampaignDto);
  }

  @Get()
  findAll(
    @Query('status') status?: CampaignStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.campaignsService.findAll(status, start, end);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignsService.update(id, updateCampaignDto);
  }

  @Post(':id/pause')
  pause(@Param('id') id: string) {
    return this.campaignsService.pause(id);
  }

  @Post(':id/resume')
  resume(@Param('id') id: string) {
    return this.campaignsService.resume(id);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.campaignsService.cancel(id);
  }
}
