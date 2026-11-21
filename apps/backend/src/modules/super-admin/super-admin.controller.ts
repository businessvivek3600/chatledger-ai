import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@nexaflow/shared-types';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_SUPPORT)
export class SuperAdminController {
  constructor(private readonly adminService: SuperAdminService) {}

  @Get('metrics')
  async getMetrics() {
    return this.adminService.getPlatformMetrics();
  }

  @Get('tenants')
  async getTenants(
    @Query('search') search?: string,
    @Query('industry') industry?: string,
  ) {
    return this.adminService.getAllTenants(search, industry);
  }

  @Patch('tenants/:id/status')
  async updateTenantStatus(
    @Param('id') id: string,
    @Body('status') status: 'ACTIVE' | 'SUSPENDED',
  ) {
    return this.adminService.updateTenantStatus(id, status);
  }

  @Get('ai-usage')
  async getAiUsage() {
    return this.adminService.getAiUsageStats();
  }

  @Get('audit-logs')
  async getAuditLogs() {
    return this.adminService.getAuditLogs();
  }

  @Get('support-tickets')
  async getTickets() {
    return this.adminService.getSupportTickets();
  }

  @Patch('support-tickets/:id/status')
  async updateTicket(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.adminService.updateTicketStatus(id, status);
  }
}
