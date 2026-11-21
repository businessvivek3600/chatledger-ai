import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenantId } from '../../common/decorators/current-user.decorator';

@Controller('campaigns')
@UseGuards(JwtAuthGuard, TenantGuard)
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  async getCampaigns(@CurrentTenantId() tenantId: string) {
    return this.campaignsService.getCampaigns(tenantId);
  }

  @Post()
  async createCampaign(
    @CurrentTenantId() tenantId: string,
    @Body() body: any,
  ) {
    return this.campaignsService.createCampaign(tenantId, body);
  }

  @Post(':id/launch')
  async launch(
    @CurrentTenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.campaignsService.launchCampaign(tenantId, id);
  }
}
