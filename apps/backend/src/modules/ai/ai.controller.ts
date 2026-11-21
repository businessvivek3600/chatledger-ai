import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenantId } from '../../common/decorators/current-user.decorator';

@Controller('ai')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('config')
  async getConfig(@CurrentTenantId() tenantId: string) {
    return this.aiService.getAiConfig(tenantId);
  }

  @Put('config')
  async updateConfig(
    @CurrentTenantId() tenantId: string,
    @Body() body: any,
  ) {
    return this.aiService.updateAiConfig(tenantId, body);
  }

  @Post('test-playground')
  async testPlayground(
    @CurrentTenantId() tenantId: string,
    @Body()
    body: {
      prompt: string;
      history?: Array<{ role: 'user' | 'assistant'; content: string }>;
    },
  ) {
    return this.aiService.testPlayground(tenantId, body.prompt, body.history);
  }

  @Get('stats')
  async getStats(@CurrentTenantId() tenantId: string) {
    return this.aiService.getAiStats(tenantId);
  }
}
