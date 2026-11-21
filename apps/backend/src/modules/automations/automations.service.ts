import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AutomationTriggerType } from '@nexaflow/shared-types';

@Injectable()
export class AutomationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getWorkflows(tenantId: string) {
    return this.prisma.automationWorkflow.findMany({
      where: { tenantId },
      include: {
        executions: {
          take: 3,
          orderBy: { startedAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getWorkflowById(tenantId: string, id: string) {
    const workflow = await this.prisma.automationWorkflow.findFirst({
      where: { id, tenantId },
      include: {
        executions: {
          take: 20,
          orderBy: { startedAt: 'desc' },
        },
      },
    });

    if (!workflow) {
      throw new NotFoundException('Automation workflow not found');
    }

    return workflow;
  }

  async saveWorkflow(tenantId: string, data: any) {
    if (data.id) {
      return this.prisma.automationWorkflow.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description,
          triggerType: data.triggerType || AutomationTriggerType.NEW_MESSAGE,
          definition: data.definition,
          isActive: data.isActive ?? true,
        },
      });
    }

    return this.prisma.automationWorkflow.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        triggerType: data.triggerType || AutomationTriggerType.NEW_MESSAGE,
        definition: data.definition,
        isActive: true,
      },
    });
  }

  async toggleActive(tenantId: string, id: string, isActive: boolean) {
    return this.prisma.automationWorkflow.update({
      where: { id },
      data: { isActive },
    });
  }

  async testRunWorkflow(tenantId: string, workflowId: string) {
    const workflow = await this.getWorkflowById(tenantId, workflowId);

    const execution = await this.prisma.workflowExecution.create({
      data: {
        workflowId,
        tenantId,
        triggerEvent: 'MANUAL_TEST_RUN',
        status: 'SUCCESS',
        stepsCompleted: [
          { step: 1, action: 'Trigger Detected', status: 'OK' },
          { step: 2, action: 'Condition Evaluated: true', status: 'OK' },
          { step: 3, action: 'Action Dispatched', status: 'OK' },
        ],
        completedAt: new Date(),
      },
    });

    await this.prisma.automationWorkflow.update({
      where: { id: workflowId },
      data: {
        executionCount: { increment: 1 },
        lastExecutedAt: new Date(),
      },
    });

    return execution;
  }
}
