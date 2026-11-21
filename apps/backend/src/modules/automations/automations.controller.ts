import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AutomationsService } from './automations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenantId } from '../../common/decorators/current-user.decorator';

@Controller('automations')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AutomationsController {
  constructor(private readonly automationsService: AutomationsService) {}

  @Get()
  async getWorkflows(@CurrentTenantId() tenantId: string) {
    return this.automationsService.getWorkflows(tenantId);
  }

  @Get(':id')
  async getWorkflow(
    @CurrentTenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.automationsService.getWorkflowById(tenantId, id);
  }

  @Post()
  async saveWorkflow(
    @CurrentTenantId() tenantId: string,
    @Body() body: any,
  ) {
    return this.automationsService.saveWorkflow(tenantId, body);
  }

  @Patch(':id/active')
  async toggleActive(
    @CurrentTenantId() tenantId: string,
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.automationsService.toggleActive(tenantId, id, isActive);
  }

  @Post(':id/test')
  async testRun(
    @CurrentTenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.automationsService.testRunWorkflow(tenantId, id);
  }
}
