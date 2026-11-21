import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenantId } from '../../common/decorators/current-user.decorator';
import { IndustryType } from '@nexaflow/shared-types';

@Controller('tenants')
@UseGuards(JwtAuthGuard, TenantGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get('current')
  async getCurrent(@CurrentTenantId() tenantId: string) {
    return this.tenantsService.getTenant(tenantId);
  }

  @Put('current')
  async updateCurrent(
    @CurrentTenantId() tenantId: string,
    @Body() body: any,
  ) {
    return this.tenantsService.updateTenant(tenantId, body);
  }

  @Get('presets')
  async getPresets(@Query('industry') industry: IndustryType) {
    return this.tenantsService.getIndustryPresets(industry);
  }

  @Post('onboarding')
  async completeOnboarding(
    @CurrentTenantId() tenantId: string,
    @Body() body: any,
  ) {
    return this.tenantsService.completeOnboarding(tenantId, body);
  }
}
