"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const campaign_entity_1 = require("../campaigns/campaign.entity");
const email_log_entity_1 = require("../campaigns/email-log.entity");
const ai_service_1 = require("../ai/ai.service");
let SchedulerService = SchedulerService_1 = class SchedulerService {
    constructor(campaignsRepository, emailLogRepository, aiService) {
        this.campaignsRepository = campaignsRepository;
        this.emailLogRepository = emailLogRepository;
        this.aiService = aiService;
        this.logger = new common_1.Logger(SchedulerService_1.name);
    }
    async handleCron() {
        this.logger.debug('Starting cron job: Processing active campaigns...');
        const start = Date.now();
        const activeCampaigns = await this.campaignsRepository.find({
            where: { status: campaign_entity_1.CampaignStatus.ACTIVE },
        });
        this.logger.debug(`Found ${activeCampaigns.length} active campaigns.`);
        for (const campaign of activeCampaigns) {
            try {
                await this.processCampaign(campaign);
            }
            catch (error) {
                this.logger.error(`Failed to process campaign ${campaign.id}`, error.stack);
            }
        }
        const duration = Date.now() - start;
        this.logger.debug(`Cron job finished in ${duration}ms`);
    }
    async processCampaign(campaign) {
        const now = new Date();
        const endDate = new Date(campaign.startDate);
        endDate.setDate(endDate.getDate() + campaign.durationDays);
        if (now > endDate) {
            this.logger.log(`Campaign ${campaign.id} expired. Marking completed.`);
            campaign.status = campaign_entity_1.CampaignStatus.COMPLETED;
            await this.campaignsRepository.save(campaign);
            return;
        }
        const isScheduledToday = this.checkSchedule(campaign, now);
        if (!isScheduledToday)
            return;
        const sentToday = await this.countSentToday(campaign);
        const limit = campaign.scheduleType === campaign_entity_1.ScheduleType.DAILY ? campaign.dailyLimit : campaign.weeklyLimit;
        if (sentToday >= limit) {
            this.logger.debug(`Campaign ${campaign.id} reached daily limit.`);
            return;
        }
        const lead = this.fetchNextLead();
        const alreadySent = await this.emailLogRepository.findOne({
            where: { campaignId: campaign.id, recipientEmail: lead.email }
        });
        if (alreadySent)
            return;
        const content = await this.aiService.generateEmailContent(campaign.aiAgentId, lead);
        const emailLog = this.emailLogRepository.create({
            campaign,
            campaignId: campaign.id,
            recipientEmail: lead.email,
            subject: content.subject,
            content: content.content,
            status: email_log_entity_1.EmailStatus.SENT,
            sentAt: new Date(),
        });
        await this.emailLogRepository.save(emailLog);
        this.logger.log(`Sent email for campaign ${campaign.id} to ${lead.email}`);
    }
    checkSchedule(campaign, date) {
        var _a;
        if (campaign.scheduleType === campaign_entity_1.ScheduleType.DAILY)
            return true;
        if (campaign.scheduleType === campaign_entity_1.ScheduleType.WEEKLY) {
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
            return ((_a = campaign.weeklyDays) === null || _a === void 0 ? void 0 : _a.includes(dayName)) || false;
        }
        return false;
    }
    async countSentToday(campaign) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        return this.emailLogRepository.count({
            where: {
                campaignId: campaign.id,
                sentAt: (0, typeorm_2.MoreThan)(startOfDay),
            }
        });
    }
    fetchNextLead() {
        return {
            email: `test-${Date.now()}@example.com`,
            name: 'Test Lead',
            companyName: 'Test Corp'
        };
    }
};
exports.SchedulerService = SchedulerService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "handleCron", null);
exports.SchedulerService = SchedulerService = SchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(campaign_entity_1.Campaign)),
    __param(1, (0, typeorm_1.InjectRepository)(email_log_entity_1.EmailLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        ai_service_1.AiService])
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map