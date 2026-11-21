import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { LeadStage, LeadPriority, LeadSource } from '@nexaflow/shared-types';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async getLeads(
    tenantId: string,
    filters: {
      stage?: LeadStage;
      assignedUserId?: string;
      search?: string;
    },
  ) {
    const where: any = { tenantId };

    if (filters.stage) where.stage = filters.stage;
    if (filters.assignedUserId) where.assignedUserId = filters.assignedUserId;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { company: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.lead.findMany({
      where,
      include: {
        customer: true,
        assignedUser: { select: { id: true, fullName: true, email: true } },
        activities: { take: 3, orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getKanbanBoard(tenantId: string) {
    const leads = await this.prisma.lead.findMany({
      where: { tenantId },
      include: {
        assignedUser: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const stages = Object.values(LeadStage);
    const columns: Record<string, any[]> = {};

    stages.forEach((stage) => {
      columns[stage] = leads.filter((lead) => lead.stage === stage);
    });

    return {
      stages,
      columns,
      totalCount: leads.length,
    };
  }

  async createLead(tenantId: string, data: any) {
    const phone = data.phone.trim();

    // Check duplicate lead by phone
    const existing = await this.prisma.lead.findFirst({
      where: { tenantId, phone },
    });

    if (existing) {
      // Update existing lead activity
      await this.prisma.leadActivity.create({
        data: {
          leadId: existing.id,
          tenantId,
          type: 'DUPLICATE_TOUCH',
          title: 'Repeat Inquiry Detected',
          description: data.requirements || 'Customer reached out again with updated interest.',
        },
      });

      return existing;
    }

    // Auto-link or create Customer
    const customer = await this.prisma.customer.upsert({
      where: {
        tenantId_phone: {
          tenantId,
          phone,
        },
      },
      create: {
        tenantId,
        phone,
        name: data.name,
        email: data.email,
        company: data.company,
      },
      update: {
        name: data.name,
      },
    });

    const lead = await this.prisma.lead.create({
      data: {
        tenantId,
        customerId: customer.id,
        name: data.name,
        phone,
        email: data.email,
        company: data.company,
        stage: data.stage || LeadStage.NEW,
        priority: data.priority || LeadPriority.MEDIUM,
        source: data.source || LeadSource.MANUAL,
        budget: data.budget ? parseFloat(data.budget) : null,
        requirements: data.requirements,
        interestedService: data.interestedService,
        assignedUserId: data.assignedUserId,
        nextFollowUpAt: data.nextFollowUpAt ? new Date(data.nextFollowUpAt) : null,
      },
      include: {
        assignedUser: { select: { id: true, fullName: true } },
      },
    });

    // Create Initial Activity
    await this.prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        tenantId,
        type: 'CREATED',
        title: 'Lead Created',
        description: `Lead created from source: ${lead.source}`,
      },
    });

    return lead;
  }

  async updateLeadStage(tenantId: string, id: string, stage: LeadStage) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, tenantId },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    const updated = await this.prisma.lead.update({
      where: { id },
      data: { stage, lastContactAt: new Date() },
    });

    await this.prisma.leadActivity.create({
      data: {
        leadId: id,
        tenantId,
        type: 'STAGE_CHANGED',
        title: `Pipeline Stage Changed`,
        description: `Moved from ${lead.stage} to ${stage}`,
      },
    });

    return updated;
  }

  async addActivity(
    tenantId: string,
    leadId: string,
    userId: string,
    dto: { type: string; title: string; description?: string },
  ) {
    return this.prisma.leadActivity.create({
      data: {
        leadId,
        tenantId,
        userId,
        type: dto.type,
        title: dto.title,
        description: dto.description,
      },
    });
  }
}
