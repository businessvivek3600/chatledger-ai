import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import {
  ConversationStatus,
  HandlingMode,
  MessageSender,
  MessageType,
  MessageDeliveryStatus,
} from '@nexaflow/shared-types';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappService: WhatsAppService,
  ) {}

  async getConversations(
    tenantId: string,
    filters: {
      status?: string;
      mode?: string;
      assignedUserId?: string;
      search?: string;
    },
  ) {
    const where: any = { tenantId };

    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'unassigned') {
        where.status = ConversationStatus.UNASSIGNED;
      } else if (filters.status === 'open') {
        where.status = ConversationStatus.OPEN;
      } else if (filters.status === 'pending') {
        where.status = ConversationStatus.PENDING;
      } else if (filters.status === 'resolved') {
        where.status = ConversationStatus.RESOLVED;
      } else if (filters.status === 'archived') {
        where.status = ConversationStatus.ARCHIVED;
      }
    }

    if (filters.mode) {
      if (filters.mode === 'ai') where.handlingMode = HandlingMode.AI;
      if (filters.mode === 'human') where.handlingMode = HandlingMode.HUMAN;
    }

    if (filters.assignedUserId) {
      where.assignedUserId = filters.assignedUserId;
    }

    if (filters.search) {
      where.customer = {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { phone: { contains: filters.search, mode: 'insensitive' } },
        ],
      };
    }

    return this.prisma.conversation.findMany({
      where,
      include: {
        customer: true,
        assignedUser: {
          select: { id: true, fullName: true, email: true },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  async getConversationById(tenantId: string, id: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id, tenantId },
      include: {
        customer: {
          include: {
            appointments: {
              include: { service: true },
              orderBy: { scheduledAt: 'desc' },
              take: 5,
            },
            paymentRequests: {
              orderBy: { createdAt: 'desc' },
              take: 5,
            },
            notes: {
              orderBy: { createdAt: 'desc' },
            },
            leads: true,
          },
        },
        assignedUser: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            senderUser: {
              select: { id: true, fullName: true },
            },
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Reset unread count upon viewing
    if (conversation.unreadCount > 0) {
      await this.prisma.conversation.update({
        where: { id },
        data: { unreadCount: 0 },
      });
    }

    return conversation;
  }

  async sendMessage(
    tenantId: string,
    conversationId: string,
    senderUserId: string,
    dto: {
      content: string;
      messageType?: MessageType;
      mediaUrl?: string;
      isInternalNote?: boolean;
    },
  ) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, tenantId },
      include: { customer: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (dto.isInternalNote) {
      // Save internal agent note
      return this.prisma.message.create({
        data: {
          tenantId,
          conversationId,
          sender: MessageSender.AGENT,
          senderUserId,
          messageType: MessageType.NOTE,
          content: dto.content,
          deliveryStatus: MessageDeliveryStatus.READ,
        },
      });
    }

    // Outbound agent message to WhatsApp
    const message = await this.prisma.message.create({
      data: {
        tenantId,
        conversationId,
        sender: MessageSender.AGENT,
        senderUserId,
        messageType: dto.messageType || MessageType.TEXT,
        content: dto.content,
        mediaUrl: dto.mediaUrl,
        deliveryStatus: MessageDeliveryStatus.SENT,
      },
    });

    // Send through WhatsApp service
    await this.whatsappService.sendWhatsAppMessage(
      tenantId,
      conversation.customer.phone,
      dto.content,
    );

    // Update conversation timestamp
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        status: ConversationStatus.OPEN,
      },
    });

    return message;
  }

  async assignConversation(
    tenantId: string,
    conversationId: string,
    assignedUserId: string,
  ) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        assignedUserId,
        status: ConversationStatus.OPEN,
      },
      include: { assignedUser: true },
    });
  }

  async updateHandlingMode(
    tenantId: string,
    conversationId: string,
    mode: HandlingMode,
  ) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { handlingMode: mode },
    });
  }

  async updateStatus(
    tenantId: string,
    conversationId: string,
    status: ConversationStatus,
  ) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { status },
    });
  }
}
