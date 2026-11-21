import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async getCustomers(
    tenantId: string,
    filters: { search?: string; tag?: string },
  ) {
    const where: any = { tenantId };

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { company: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.customer.findMany({
      where,
      include: {
        _count: {
          select: {
            appointments: true,
            conversations: true,
            paymentRequests: true,
          },
        },
      },
      orderBy: { lastInteractionAt: 'desc' },
    });
  }

  async getCustomerById(tenantId: string, id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, tenantId },
      include: {
        appointments: {
          include: { service: true, assignedUser: { select: { fullName: true } } },
          orderBy: { scheduledAt: 'desc' },
        },
        paymentRequests: {
          include: { invoice: true },
          orderBy: { createdAt: 'desc' },
        },
        conversations: {
          include: {
            messages: { take: 5, orderBy: { createdAt: 'desc' } },
          },
          orderBy: { lastMessageAt: 'desc' },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
        },
        leads: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async createCustomer(tenantId: string, data: any) {
    return this.prisma.customer.create({
      data: {
        tenantId,
        name: data.name,
        phone: data.phone.trim(),
        email: data.email,
        company: data.company,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        type: data.type || 'REGULAR',
        tags: data.tags || [],
      },
    });
  }

  async addNote(
    tenantId: string,
    customerId: string,
    userId: string,
    content: string,
  ) {
    return this.prisma.customerNote.create({
      data: {
        tenantId,
        customerId,
        userId,
        content,
      },
    });
  }
}
