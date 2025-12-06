export declare class AiService {
    private readonly logger;
    private openai;
    constructor();
    generateEmailContent(agentId: string, context: any): Promise<{
        subject: string;
        content: string;
    }>;
}
