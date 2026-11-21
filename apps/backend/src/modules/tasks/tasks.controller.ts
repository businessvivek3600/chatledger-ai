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
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenantId } from '../../common/decorators/current-user.decorator';
import { TaskStatus } from '@nexaflow/shared-types';

@Controller('tasks')
@UseGuards(JwtAuthGuard, TenantGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getTasks(
    @CurrentTenantId() tenantId: string,
    @Query('status') status?: TaskStatus,
    @Query('assignedUserId') assignedUserId?: string,
  ) {
    return this.tasksService.getTasks(tenantId, { status, assignedUserId });
  }

  @Post()
  async createTask(
    @CurrentTenantId() tenantId: string,
    @Body() body: any,
  ) {
    return this.tasksService.createTask(tenantId, body);
  }

  @Patch(':id/status')
  async updateStatus(
    @CurrentTenantId() tenantId: string,
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ) {
    return this.tasksService.updateStatus(tenantId, id, status);
  }
}
