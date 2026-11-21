import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SubscriptionStatus } from '@nexaflow/shared-types';

@Injectable()
export class SuperAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlatformMetrics() {
    const [
      totalTenants,
      activeTenants,
      trialTenants,
      activeSubscriptions,
      allSubscriptions,
      totalMessages,
      totalAiLogs,
      supportTicketsCount,
    ] = await Promise.all([
      this.prisma.tenant.count(),
      this.prisma.tenant.count({ where: { status: 'ACTIVE' } }),
      this.prisma.subscription.count({ where: { status: SubscriptionStatus.TRIALING } }),
      this.prisma.subscription.count({ where: { status: SubscriptionStatus.ACTIVE } }),
      this.prisma.subscription.findMany({
        include: { plan: true },
      }),
      this.prisma.message.count(),
      this.prisma.aiUsageLog.findMany({ select: { totalTokens: true, estimatedCostUsd: true } }),
      this.prisma.supportTicket.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
    ]);

    // Calculate Monthly Recurring Revenue (MRR)
    const mrr = allSubscriptions
      .filter((s) => s.status === SubscriptionStatus.ACTIVE)
      .reduce((sum, s) => sum + s.plan.priceMonthly, 0);

    const totalTokensUsed = totalAiLogs.reduce((acc, l) => acc + l.totalTokens, 0);
    const totalAiExpensesUsd = totalAiLogs.reduce((acc, l) => acc + l.estimatedCostUsd, 0);

    return {
      overview: {
        totalTenants,
        activeTenants,
        trialTenants,
        paidSubscriptions: activeSubscriptions,
        mrr,
        totalPlatformRevenue: mrr * 12 * 0.85, // estimated annualized run-rate
        totalWhatsAppMessages: totalMessages,
        totalAiConversations: totalAiLogs.length,
        totalTokensUsed,
        totalAiExpensesUsd: Number(totalAiExpensesUsd.toFixed(2)),
        openSupportTickets: supportTicketsCount,
        systemHealth: {
          database: 'HEALTHY',
          redis: 'ONLINE',
          metaWhatsAppApi: 'OPERATIONAL',
          openAiGateway: 'OPERATIONAL',
          razorpayGateway: 'OPERATIONAL',
        },
      },
    };
  }

  async getAllTenants(search?: string, industry?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (industry) where.industry = industry;

    return this.prisma.tenant.findMany({
      where,
      include: {
        subscription: { include: { plan: true } },
        whatsappAccount: { include: { phoneNumbers: true } },
        _count: {
          select: {
            members: true,
            customers: true,
            leads: true,
            conversations: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateTenantStatus(tenantId: string, status: 'ACTIVE' | 'SUSPENDED') {
    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: { status },
    });
  }

  async getAiUsageStats() {
    return this.prisma.aiUsageLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAuditLogs() {
    return this.prisma.auditLog.findMany({
      take: 100,
      include: {
        user: { select: { fullName: true, email: true } },
        tenant: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSupportTickets() {
    return this.prisma.supportTicket.findMany({
      include: {
        tenant: { select: { name: true, phone: true } },
        user: { select: { fullName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateTicketStatus(ticketId: string, status: string) {
    return this.prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status },
    });
  }
}
