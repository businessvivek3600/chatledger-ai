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
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenantId } from '../../common/decorators/current-user.decorator';
import { AppointmentStatus } from '@nexaflow/shared-types';

@Controller('appointments')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async getAppointments(
    @CurrentTenantId() tenantId: string,
    @Query('status') status?: AppointmentStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('assignedUserId') assignedUserId?: string,
  ) {
    return this.appointmentsService.getAppointments(tenantId, {
      status,
      startDate,
      endDate,
      assignedUserId,
    });
  }

  @Get('services')
  async getServices(@CurrentTenantId() tenantId: string) {
    return this.appointmentsService.getServices(tenantId);
  }

  @Post('services')
  async createService(
    @CurrentTenantId() tenantId: string,
    @Body() body: any,
  ) {
    return this.appointmentsService.createService(tenantId, body);
  }

  @Get('available-slots')
  async getAvailableSlots(
    @CurrentTenantId() tenantId: string,
    @Query('date') date: string,
    @Query('serviceId') serviceId?: string,
  ) {
    return this.appointmentsService.getAvailableSlots(tenantId, date, serviceId);
  }

  @Post('book')
  async book(
    @CurrentTenantId() tenantId: string,
    @Body() body: any,
  ) {
    return this.appointmentsService.bookAppointment(tenantId, body);
  }

  @Patch(':id/status')
  async updateStatus(
    @CurrentTenantId() tenantId: string,
    @Param('id') id: string,
    @Body('status') status: AppointmentStatus,
  ) {
    return this.appointmentsService.updateStatus(tenantId, id, status);
  }
}
