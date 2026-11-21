import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@nexaflow/shared-types';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getTeamMembers(tenantId: string) {
    const members = await this.prisma.tenantMember.findMany({
      where: { tenantId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            role: true,
            status: true,
            lastLoginAt: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Augment with employee performance statistics
    const augmented = await Promise.all(
      members.map(async (m) => {
        const [assignedLeads, assignedAppointments, handledConversations] =
          await Promise.all([
            this.prisma.lead.count({
              where: { tenantId, assignedUserId: m.userId },
            }),
            this.prisma.appointment.count({
              where: { tenantId, assignedUserId: m.userId },
            }),
            this.prisma.conversation.count({
              where: { tenantId, assignedUserId: m.userId },
            }),
          ]);

        return {
          ...m,
          performance: {
            assignedLeads,
            assignedAppointments,
            handledConversations,
          },
        };
      }),
    );

    return augmented;
  }

  async inviteMember(
    tenantId: string,
    data: {
      email: string;
      fullName: string;
      phone?: string;
      role: UserRole;
      permissions?: string[];
    },
  ) {
    const email = data.email.toLowerCase();

    // Check if user already exists
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const defaultPassword = 'Password123!';
      const passwordHash = await bcrypt.hash(defaultPassword, 10);

      user = await this.prisma.user.create({
        data: {
          email,
          fullName: data.fullName,
          phone: data.phone,
          passwordHash,
          role: data.role,
          status: 'ACTIVE',
        },
      });
    }

    // Check existing membership
    const existingMember = await this.prisma.tenantMember.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId: user.id,
        },
      },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this workspace');
    }

    return this.prisma.tenantMember.create({
      data: {
        tenantId,
        userId: user.id,
        role: data.role,
        permissions: data.permissions || ['view_assigned_conversations', 'send_messages'],
      },
      include: { user: true },
    });
  }

  async updateMemberRole(
    tenantId: string,
    memberId: string,
    data: { role: UserRole; permissions: string[] },
  ) {
    return this.prisma.tenantMember.update({
      where: { id: memberId },
      data: {
        role: data.role,
        permissions: data.permissions,
      },
      include: { user: true },
    });
  }

  async removeMember(tenantId: string, memberId: string) {
    const member = await this.prisma.tenantMember.findFirst({
      where: { id: memberId, tenantId },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    if (member.isOwner) {
      throw new ConflictException('The business owner cannot be removed');
    }

    return this.prisma.tenantMember.delete({
      where: { id: memberId },
    });
  }
}
