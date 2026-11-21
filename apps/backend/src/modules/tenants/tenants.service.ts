import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { IndustryType } from '@nexaflow/shared-types';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTenant(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        subscription: {
          include: { plan: true },
        },
        whatsappAccount: {
          include: { phoneNumbers: true, templates: true },
        },
        aiAssistant: true,
        _count: {
          select: {
            members: true,
            customers: true,
            leads: true,
            conversations: true,
            appointments: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Workspace not found');
    }

    return tenant;
  }

  async updateTenant(tenantId: string, data: any) {
    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        gstin: data.gstin,
        timezone: data.timezone,
        currency: data.currency,
        logoUrl: data.logoUrl,
        workingHours: data.workingHours,
      },
    });
  }

  getIndustryPresets(industry: IndustryType) {
    const presets: Record<string, any> = {
      [IndustryType.CLINIC]: {
        assistantName: 'Dr. HealthBot',
        tone: 'Warm Professional & Reassuring',
        personality: 'Compassionate, clinical yet empathetic, patient-focused, and precise.',
        sampleServices: [
          { name: 'General Physician Consultation', price: 800, durationMinutes: 30 },
          { name: 'Specialist Consultation', price: 1500, durationMinutes: 30 },
          { name: 'Preventive Health Screening', price: 2999, durationMinutes: 60 },
        ],
        faqSamples: [
          { q: 'What are your clinic operating hours?', a: 'Monday to Saturday 9:00 AM to 8:00 PM.' },
          { q: 'Can I reschedule my appointment?', a: 'Yes, anytime up to 4 hours in advance via WhatsApp.' },
        ],
        pipelineStages: ['New Patient', 'Consultation Booked', 'Follow-up Due', 'Treatment Complete'],
      },
      [IndustryType.SALON]: {
        assistantName: 'GlowStylist AI',
        tone: 'Vibrant, Chic & Welcoming',
        personality: 'Friendly, stylish, beauty-expert, eager to pamper customers.',
        sampleServices: [
          { name: 'Hair Spa & Deep Conditioning', price: 1800, durationMinutes: 60 },
          { name: 'Express Facial & Glow Therapy', price: 2200, durationMinutes: 45 },
          { name: 'Classic Pedicure & Manicure', price: 1200, durationMinutes: 60 },
        ],
        faqSamples: [
          { q: 'Do you take bridal bookings?', a: 'Yes! We offer customized bridal packages and trial makeup sessions.' },
          { q: 'What brand of products do you use?', a: 'We use premium L\'Oréal Professionnel and Dermalogica products.' },
        ],
        pipelineStages: ['New Inquiry', 'Package Selected', 'Appointment Booked', 'Repeat Client'],
      },
      [IndustryType.COACHING]: {
        assistantName: 'EduMentor AI',
        tone: 'Motivating & Instructive',
        personality: 'Encouraging, disciplined, academic, clear guidance for students & parents.',
        sampleServices: [
          { name: 'Diagnostic Assessment Test', price: 500, durationMinutes: 60 },
          { name: '1-on-1 Academic Counseling', price: 1200, durationMinutes: 45 },
          { name: 'Foundation Crash Course Enrollment', price: 15000, durationMinutes: 120 },
        ],
        faqSamples: [
          { q: 'What grades do you teach?', a: 'We coach students from Grade 8 to 12 for CBSE, ICSE, JEE, and NEET.' },
          { q: 'Do you provide demo classes?', a: 'Yes! You can attend 2 complimentary demo classes.' },
        ],
        pipelineStages: ['Lead Received', 'Demo Scheduled', 'Attended Demo', 'Enrolled', 'Fee Paid'],
      },
      [IndustryType.REAL_ESTATE]: {
        assistantName: 'RealtyAdvisor AI',
        tone: 'Executive, Trustworthy & High-Value',
        personality: 'Professional property consultant, market-savvy, focused on scheduling site visits.',
        sampleServices: [
          { name: 'Property Site Visit & Walkthrough', price: 0, durationMinutes: 90 },
          { name: 'Investment Portfolio Consultation', price: 2500, durationMinutes: 60 },
          { name: 'Home Loan Eligibility Assessment', price: 0, durationMinutes: 30 },
        ],
        faqSamples: [
          { q: 'What projects are currently available?', a: 'We offer 2BHK and 3BHK luxury apartments in prime locations starting from ₹1.2 Cr.' },
          { q: 'Can I book a weekend site tour?', a: 'Yes, our sales representative will coordinate cab pick-and-drop for site tours.' },
        ],
        pipelineStages: ['Inquiry', 'Budget Qualified', 'Site Visit Scheduled', 'Negotiation', 'Booking Done'],
      },
      [IndustryType.RETAIL]: {
        assistantName: 'StoreBuddy AI',
        tone: 'Fast, Helpful & Courteous',
        personality: 'Product specialist, quick to check stock, prices, and offer catalog links.',
        sampleServices: [
          { name: 'Personal Shopping Assistance', price: 0, durationMinutes: 30 },
          { name: 'Custom Order Booking', price: 0, durationMinutes: 20 },
        ],
        faqSamples: [
          { q: 'What is your return/exchange policy?', a: 'We provide 7-day hassle-free exchanges with original invoice.' },
          { q: 'Do you deliver locally?', a: 'Yes, same-day delivery on orders placed before 3:00 PM.' },
        ],
        pipelineStages: ['Inquiry', 'Catalog Shared', 'Cart Created', 'Paid & Dispatched'],
      },
    };

    return presets[industry] || presets[IndustryType.CLINIC];
  }

  async completeOnboarding(tenantId: string, dto: any) {
    const preset = this.getIndustryPresets(dto.industry || IndustryType.CLINIC);

    return this.prisma.$transaction(async (tx) => {
      // 1. Update Tenant
      const updatedTenant = await tx.tenant.update({
        where: { id: tenantId },
        data: {
          name: dto.name,
          industry: dto.industry,
          phone: dto.phone,
          city: dto.city,
          state: dto.state,
          address: dto.address,
          status: 'ACTIVE',
        },
      });

      // 2. Setup AI Assistant
      await tx.aiAssistant.upsert({
        where: { tenantId },
        create: {
          tenantId,
          name: dto.assistantName || preset.assistantName,
          personality: preset.personality,
          tone: preset.tone,
          businessIntro: dto.businessIntro || `Welcome to ${dto.name}.`,
          productsServices: preset.sampleServices,
          isEnabled: true,
        },
        update: {
          name: dto.assistantName || preset.assistantName,
          personality: preset.personality,
          tone: preset.tone,
          businessIntro: dto.businessIntro,
          productsServices: preset.sampleServices,
        },
      });

      // 3. Add default appointment services if none exist
      const existingServices = await tx.appointmentService.count({ where: { tenantId } });
      if (existingServices === 0 && preset.sampleServices) {
        for (const s of preset.sampleServices) {
          await tx.appointmentService.create({
            data: {
              tenantId,
              name: s.name,
              price: s.price,
              durationMinutes: s.durationMinutes,
            },
          });
        }
      }

      // 4. Default Mon-Sat availability slots if none exist
      const existingSlots = await tx.availabilitySlot.count({ where: { tenantId } });
      if (existingSlots === 0) {
        for (let d = 1; d <= 6; d++) {
          await tx.availabilitySlot.create({
            data: {
              tenantId,
              dayOfWeek: d,
              startTime: '09:00',
              endTime: '18:00',
            },
          });
        }
      }

      return updatedTenant;
    });
  }
}
