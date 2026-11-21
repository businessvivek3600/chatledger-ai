import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AppointmentStatus } from '@nexaflow/shared-types';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAppointments(
    tenantId: string,
    filters: {
      status?: AppointmentStatus;
      startDate?: string;
      endDate?: string;
      assignedUserId?: string;
    },
  ) {
    const where: any = { tenantId };

    if (filters.status) where.status = filters.status;
    if (filters.assignedUserId) where.assignedUserId = filters.assignedUserId;
    if (filters.startDate || filters.endDate) {
      where.scheduledAt = {};
      if (filters.startDate) where.scheduledAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.scheduledAt.lte = new Date(filters.endDate);
    }

    return this.prisma.appointment.findMany({
      where,
      include: {
        customer: true,
        service: true,
        assignedUser: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async getServices(tenantId: string) {
    return this.prisma.appointmentService.findMany({
      where: { tenantId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async createService(tenantId: string, data: any) {
    return this.prisma.appointmentService.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        durationMinutes: parseInt(data.durationMinutes) || 30,
        price: parseFloat(data.price) || 0,
        currency: data.currency || 'INR',
        isActive: true,
      },
    });
  }

  async getAvailableSlots(tenantId: string, dateStr: string, serviceId?: string) {
    const targetDate = new Date(dateStr);
    const dayOfWeek = targetDate.getDay(); // 0-6

    // 1. Get tenant's availability rule for this day
    const availability = await this.prisma.availabilitySlot.findFirst({
      where: { tenantId, dayOfWeek, isHoliday: false },
    });

    if (!availability) {
      return { availableSlots: [], message: 'Business is closed on this day' };
    }

    // 2. Default slots based on start/end hours
    const [startHour, startMin] = availability.startTime.split(':').map(Number);
    const [endHour, endMin] = availability.endTime.split(':').map(Number);

    const slotDuration = 30; // default 30 mins
    const potentialSlots: Date[] = [];

    const slotCursor = new Date(targetDate);
    slotCursor.setHours(startHour, startMin, 0, 0);

    const endCursor = new Date(targetDate);
    endCursor.setHours(endHour, endMin, 0, 0);

    while (slotCursor < endCursor) {
      potentialSlots.push(new Date(slotCursor));
      slotCursor.setMinutes(slotCursor.getMinutes() + slotDuration);
    }

    // 3. Find existing bookings for this day
    const dayStart = new Date(targetDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);

    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        tenantId,
        scheduledAt: { gte: dayStart, lte: dayEnd },
        status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] },
      },
    });

    // 4. Filter out colliding slots
    const available = potentialSlots.filter((slot) => {
      const slotTime = slot.getTime();
      return !existingAppointments.some((appt) => {
        const apptStart = new Date(appt.scheduledAt).getTime();
        const apptEnd = new Date(appt.endAt).getTime();
        return slotTime >= apptStart && slotTime < apptEnd;
      });
    });

    return {
      availableSlots: available.map((s) => ({
        iso: s.toISOString(),
        formattedTime: s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })),
    };
  }

  async bookAppointment(tenantId: string, data: any) {
    const scheduledAt = new Date(data.scheduledAt);
    const service = await this.prisma.appointmentService.findFirst({
      where: { id: data.serviceId, tenantId },
    });

    if (!service) {
      throw new NotFoundException('Selected service not found');
    }

    const durationMinutes = service.durationMinutes || 30;
    const endAt = new Date(scheduledAt.getTime() + durationMinutes * 60 * 1000);

    // Transactional Collision Check to prevent double bookings
    return this.prisma.$transaction(async (tx) => {
      const collision = await tx.appointment.findFirst({
        where: {
          tenantId,
          status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] },
          OR: [
            {
              scheduledAt: { lte: scheduledAt },
              endAt: { gt: scheduledAt },
            },
            {
              scheduledAt: { lt: endAt },
              endAt: { gte: endAt },
            },
          ],
        },
      });

      if (collision) {
        throw new ConflictException(
          'This time slot has already been booked. Please choose another available slot.',
        );
      }

      const appointment = await tx.appointment.create({
        data: {
          tenantId,
          customerId: data.customerId,
          serviceId: service.id,
          assignedUserId: data.assignedUserId,
          scheduledAt,
          endAt,
          durationMinutes,
          status: AppointmentStatus.CONFIRMED,
          notes: data.notes,
          location: data.location || 'Main Office',
        },
        include: {
          customer: true,
          service: true,
          assignedUser: true,
        },
      });

      return appointment;
    });
  }

  async updateStatus(tenantId: string, id: string, status: AppointmentStatus) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status },
      include: { customer: true, service: true },
    });
  }
}
