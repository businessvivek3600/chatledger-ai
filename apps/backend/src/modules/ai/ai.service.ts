import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAiConfig(tenantId: string) {
    const assistant = await this.prisma.aiAssistant.findUnique({
      where: { tenantId },
    });

    if (!assistant) {
      throw new NotFoundException('AI Assistant configuration not found');
    }

    return assistant;
  }

  async updateAiConfig(tenantId: string, data: any) {
    return this.prisma.aiAssistant.upsert({
      where: { tenantId },
      create: {
        tenantId,
        name: data.name || 'NexaBot',
        personality: data.personality,
        language: data.language,
        tone: data.tone,
        businessIntro: data.businessIntro,
        productsServices: data.productsServices,
        pricingInfo: data.pricingInfo,
        businessHours: data.businessHours,
        contactDetails: data.contactDetails,
        appointmentRules: data.appointmentRules,
        escalationRules: data.escalationRules,
        handoverConditions: data.handoverConditions,
        isEnabled: data.isEnabled ?? true,
        model: data.model || 'gpt-4o-mini',
        temperature: data.temperature || 0.4,
      },
      update: {
        name: data.name,
        personality: data.personality,
        language: data.language,
        tone: data.tone,
        businessIntro: data.businessIntro,
        productsServices: data.productsServices,
        pricingInfo: data.pricingInfo,
        businessHours: data.businessHours,
        contactDetails: data.contactDetails,
        appointmentRules: data.appointmentRules,
        escalationRules: data.escalationRules,
        handoverConditions: data.handoverConditions,
        isEnabled: data.isEnabled,
        model: data.model,
        temperature: data.temperature,
      },
    });
  }

  /**
   * AI Playground Testing with Tool Calling Simulation
   */
  async testPlayground(
    tenantId: string,
    prompt: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  ) {
    const assistant = await this.getAiConfig(tenantId);

    // Retrieve Knowledge Base Chunks
    const chunks = await this.prisma.knowledgeChunk.findMany({
      where: { tenantId },
      take: 4,
    });
    const knowledgeSnippets = chunks.map((c) => c.content).join('\n---\n');

    const lower = prompt.toLowerCase();
    let reply = '';
    const toolsExecuted: Array<{ tool: string; args: any; result: any }> = [];

    // Tool 1: Appointment Availability
    if (lower.includes('appointment') || lower.includes('book') || lower.includes('slot') || lower.includes('schedule')) {
      const services = await this.prisma.appointmentService.findMany({
        where: { tenantId, isActive: true },
      });

      toolsExecuted.push({
        tool: 'check_available_slots',
        args: { date: 'tomorrow', tenantId },
        result: {
          availableSlots: ['11:00 AM', '02:30 PM', '04:30 PM', '06:00 PM'],
          servicesCount: services.length,
        },
      });

      const serviceList = services.map((s) => `• ${s.name} - ₹${s.price} (${s.durationMinutes} mins)`).join('\n');
      reply = `I checked our calendar and we have available slots tomorrow at 11:00 AM, 2:30 PM, 4:30 PM, and 6:00 PM.\n\nHere are our available services:\n${serviceList}\n\nWould you like me to reserve one of these times for you? Just let me know your preferred time and full name.`;
    }
    // Tool 2: Human Handover
    else if (lower.includes('human') || lower.includes('agent') || lower.includes('doctor') || lower.includes('urgent') || lower.includes('call')) {
      toolsExecuted.push({
        tool: 'escalate_to_human_agent',
        args: { reason: 'Customer requested human representative' },
        result: { status: 'HANDOVER_TRIGGERED', queue: 'FRONT_DESK' },
      });

      reply = `I have marked this conversation for priority human handover and notified our team. An agent will join this chat in just a moment to assist you directly!`;
    }
    // Tool 3: Pricing & Catalog
    else if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('fee')) {
      toolsExecuted.push({
        tool: 'query_pricing_catalog',
        args: { tenantId },
        result: { pricing: assistant.pricingInfo || 'Standard Rates' },
      });

      reply = `Here is our official pricing overview:\n• Consultation Fee: ₹800 - ₹1,200\n• Detailed Assessment: Included\n• All payments are secured via Razorpay UPI / Cards.\n\n${knowledgeSnippets ? `Note: ${knowledgeSnippets.substring(0, 150)}...` : ''}\n\nWould you like to book a session?`;
    }
    // General Knowledge Response
    else {
      reply = `Hello! I am ${assistant.name}, your virtual business assistant. I'm configured with a ${assistant.tone.toLowerCase()} tone to assist your customers with bookings, service inquiries, and questions.\n\nKnowledge Base Context Active: ${chunks.length} chunks indexed.\n\nHow can I help you test our workflows today?`;
    }

    return {
      reply,
      toolsExecuted,
      model: assistant.model,
      tokensUsed: Math.round((prompt.length + reply.length) / 3.5),
      confidence: 0.98,
    };
  }

  async getAiStats(tenantId: string) {
    const logs = await this.prisma.aiUsageLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const totalTokens = logs.reduce((acc, l) => acc + l.totalTokens, 0);
    const totalCostUsd = logs.reduce((acc, l) => acc + l.estimatedCostUsd, 0);

    return {
      totalInteractions: logs.length,
      totalTokens,
      totalCostUsd: Number(totalCostUsd.toFixed(4)),
      averageResponseTimeMs: logs.length > 0 ? Math.round(logs.reduce((acc, l) => acc + l.executionTimeMs, 0) / logs.length) : 350,
      recentLogs: logs.slice(0, 10),
    };
  }
}
