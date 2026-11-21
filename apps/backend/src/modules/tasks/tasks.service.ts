import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TaskStatus, TaskPriority } from '@nexaflow/shared-types';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async getTasks(
    tenantId: string,
    filters: { status?: TaskStatus; assignedUserId?: string },
  ) {
    const where: any = { tenantId };
    if (filters.status) where.status = filters.status;
    if (filters.assignedUserId) where.assignedUserId = filters.assignedUserId;

    return this.prisma.task.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        lead: { select: { id: true, name: true, stage: true } },
        assignedUser: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async createTask(tenantId: string, data: any) {
    return this.prisma.task.create({
      data: {
        tenantId,
        title: data.title,
        description: data.description,
        priority: data.priority || TaskPriority.MEDIUM,
        status: TaskStatus.PENDING,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        assignedUserId: data.assignedUserId,
        customerId: data.customerId,
        leadId: data.leadId,
        conversationId: data.conversationId,
      },
      include: {
        customer: true,
        assignedUser: true,
      },
    });
  }

  async updateStatus(tenantId: string, id: string, status: TaskStatus) {
    const task = await this.prisma.task.findFirst({
      where: { id, tenantId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.update({
      where: { id },
      data: { status },
    });
  }
}
