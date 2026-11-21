import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import {
  PaymentStatus,
  SubscriptionPlanTier,
  SubscriptionStatus,
} from '@nexaflow/shared-types';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappService: WhatsAppService,
  ) {}

  /**
   * 1. Business Customer Payments & Invoices
   */
  async getPaymentRequests(tenantId: string) {
    return this.prisma.paymentRequest.findMany({
      where: { tenantId },
      include: {
        customer: true,
        invoice: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPaymentRequest(
    tenantId: string,
    data: {
      customerId: string;
      subtotal: number;
      description: string;
      includeGst?: boolean;
      sendViaWhatsApp?: boolean;
    },
  ) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: data.customerId, tenantId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const subtotal = parseFloat(data.subtotal.toString());
    const taxGst = data.includeGst ? Math.round(subtotal * 0.18) : 0; // 18% GST in India
    const totalAmount = subtotal + taxGst;

    const payReqId = randomUUID();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const mockPaymentLink = `http://localhost:3000/pay/${payReqId}`;

    const result = await this.prisma.$transaction(async (tx) => {
      const payReq = await tx.paymentRequest.create({
        data: {
          id: payReqId,
          tenantId,
          customerId: customer.id,
          amount: totalAmount,
          currency: 'INR',
          description: data.description,
          invoiceNumber,
          razorpayPaymentLink: mockPaymentLink,
          status: PaymentStatus.PENDING,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      const invoice = await tx.customerInvoice.create({
        data: {
          tenantId,
          customerId: customer.id,
          paymentRequestId: payReq.id,
          invoiceNumber,
          subtotal,
          taxGst,
          totalAmount,
          currency: 'INR',
          status: 'ISSUED',
          items: [
            {
              description: data.description,
              qty: 1,
              unitPrice: subtotal,
              amount: subtotal,
            },
          ],
        },
      });

      return { payReq, invoice };
    });

    // Optionally send direct WhatsApp payment notification
    if (data.sendViaWhatsApp) {
      const message = `Hello ${customer.name}, your invoice #${invoiceNumber} for ₹${totalAmount.toLocaleString('en-IN')} has been generated. You can pay securely via UPI/Card here: ${mockPaymentLink}`;
      await this.whatsappService.sendWhatsAppMessage(
        tenantId,
        customer.phone,
        message,
      );
    }

    return result;
  }

  async markPaymentPaid(tenantId: string, paymentRequestId: string) {
    const payment = await this.prisma.paymentRequest.findFirst({
      where: { id: paymentRequestId, tenantId },
      include: { customer: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment request not found');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const paidReq = await tx.paymentRequest.update({
        where: { id: paymentRequestId },
        data: {
          status: PaymentStatus.PAID,
          paidAt: new Date(),
        },
      });

      await tx.customerInvoice.updateMany({
        where: { paymentRequestId },
        data: { status: 'PAID' },
      });

      // Update customer lifetime value
      await tx.customer.update({
        where: { id: payment.customerId },
        data: {
          totalPurchases: { increment: 1 },
          lifetimeValue: { increment: payment.amount },
        },
      });

      return paidReq;
    });

    return updated;
  }

  async getPublicPaymentDetails(id: string) {
    const payment = await this.prisma.paymentRequest.findFirst({
      where: {
        OR: [
          { id },
          { invoiceNumber: id },
          { razorpayPaymentLink: { contains: id } },
        ],
      },
      include: {
        customer: true,
        tenant: true,
        invoice: true,
      },
    });

    if (!payment) {
      // Fallback: return the first available payment request if it's the demo ID "apex_demo_pay"
      if (id === 'apex_demo_pay' || id.includes('demo')) {
        const demoPayment = await this.prisma.paymentRequest.findFirst({
          include: { customer: true, tenant: true, invoice: true },
        });
        if (demoPayment) return demoPayment;
      }
      throw new NotFoundException('Payment request not found');
    }

    return payment;
  }

  async processPublicPayment(id: string, paymentMethod: string = 'UPI') {
    let payment = await this.prisma.paymentRequest.findFirst({
      where: {
        OR: [
          { id },
          { invoiceNumber: id },
          { razorpayPaymentLink: { contains: id } },
        ],
      },
      include: { customer: true, tenant: true },
    });

    if (!payment && (id === 'apex_demo_pay' || id.includes('demo'))) {
      payment = await this.prisma.paymentRequest.findFirst({
        include: { customer: true, tenant: true },
      });
    }

    if (!payment) {
      throw new NotFoundException('Payment request not found');
    }

    const razorpayPaymentId = `pay_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

    const updated = await this.prisma.$transaction(async (tx) => {
      const paidReq = await tx.paymentRequest.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.PAID,
          paidAt: new Date(),
          razorpayPaymentId,
        },
      });

      await tx.customerInvoice.updateMany({
        where: { paymentRequestId: payment.id },
        data: { status: 'PAID' },
      });

      await tx.customer.update({
        where: { id: payment.customerId },
        data: {
          totalPurchases: { increment: 1 },
          lifetimeValue: { increment: payment.amount },
        },
      });

      return paidReq;
    });

    try {
      const confirmationMsg = `✅ *Payment Received!* Thank you ${payment.customer.name}. We have received your payment of ₹${payment.amount.toLocaleString('en-IN')} for "${payment.description || 'Consultation'}" via ${paymentMethod}.\n\nReference ID: *${razorpayPaymentId}*\nYour receipt & appointment are confirmed!`;
      await this.whatsappService.sendWhatsAppMessage(
        payment.tenantId,
        payment.customer.phone,
        confirmationMsg,
      );
    } catch (e) {
      this.logger.warn(`Could not send WhatsApp confirmation: ${e}`);
    }

    return {
      success: true,
      transactionId: razorpayPaymentId,
      amount: payment.amount,
      payment: updated,
    };
  }

  /**
   * 2. NexaFlow SaaS Subscription Billing
   */
  async getSubscriptionPlans() {
    return this.prisma.subscriptionPlan.findMany({
      orderBy: { priceMonthly: 'asc' },
    });
  }

  async getCurrentSubscription(tenantId: string) {
    const sub = await this.prisma.subscription.findUnique({
      where: { tenantId },
      include: { plan: true },
    });

    if (!sub) {
      throw new NotFoundException('Subscription not found');
    }

    return sub;
  }

  async upgradePlan(tenantId: string, planTier: SubscriptionPlanTier) {
    const targetPlan = await this.prisma.subscriptionPlan.findUnique({
      where: { tier: planTier },
    });

    if (!targetPlan) {
      throw new NotFoundException('Requested subscription tier does not exist');
    }

    return this.prisma.subscription.upsert({
      where: { tenantId },
      create: {
        tenantId,
        planId: targetPlan.id,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      update: {
        planId: targetPlan.id,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      include: { plan: true },
    });
  }
}
