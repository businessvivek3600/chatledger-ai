import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenantId, CurrentUser } from '../../common/decorators/current-user.decorator';
import { LeadStage } from '@nexaflow/shared-types';

@Controller('leads')
@UseGuards(JwtAuthGuard, TenantGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  async getLeads(
    @CurrentTenantId() tenantId: string,
    @Query('stage') stage?: LeadStage,
    @Query('assignedUserId') assignedUserId?: string,
    @Query('search') search?: string,
  ) {
    return this.leadsService.getLeads(tenantId, {
      stage,
      assignedUserId,
      search,
    });
  }

  @Get('kanban')
  async getKanban(@CurrentTenantId() tenantId: string) {
    return this.leadsService.getKanbanBoard(tenantId);
  }

  @Post()
  async createLead(
    @CurrentTenantId() tenantId: string,
    @Body() body: any,
  ) {
    return this.leadsService.createLead(tenantId, body);
  }

  @Patch(':id/stage')
  async updateStage(
    @CurrentTenantId() tenantId: string,
    @Param('id') id: string,
    @Body('stage') stage: LeadStage,
  ) {
    return this.leadsService.updateLeadStage(tenantId, id, stage);
  }

  @Post(':id/activities')
  async addActivity(
    @CurrentTenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body() body: { type: string; title: string; description?: string },
  ) {
    return this.leadsService.addActivity(tenantId, id, userId, body);
  }
}
