import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenantId } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/roles.decorator';
import { SubscriptionPlanTier } from '@nexaflow/shared-types';

@Controller('payments')
@UseGuards(JwtAuthGuard, TenantGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('requests')
  async getPaymentRequests(@CurrentTenantId() tenantId: string) {
    return this.paymentsService.getPaymentRequests(tenantId);
  }

  @Post('requests')
  async createPaymentRequest(
    @CurrentTenantId() tenantId: string,
    @Body() body: any,
  ) {
    return this.paymentsService.createPaymentRequest(tenantId, body);
  }

  @Patch('requests/:id/mark-paid')
  async markPaid(
    @CurrentTenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.paymentsService.markPaymentPaid(tenantId, id);
  }

  @Public()
  @Get('public/request/:id')
  async getPublicPaymentDetails(@Param('id') id: string) {
    return this.paymentsService.getPublicPaymentDetails(id);
  }

  @Public()
  @Post('public/request/:id/pay')
  async processPublicPayment(
    @Param('id') id: string,
    @Body('paymentMethod') paymentMethod: string,
  ) {
    return this.paymentsService.processPublicPayment(id, paymentMethod || 'UPI');
  }

  @Public()
  @Get('plans')
  async getPlans() {
    return this.paymentsService.getSubscriptionPlans();
  }

  @Get('subscription')
  async getSubscription(@CurrentTenantId() tenantId: string) {
    return this.paymentsService.getCurrentSubscription(tenantId);
  }

  @Post('subscription/upgrade')
  async upgradeSubscription(
    @CurrentTenantId() tenantId: string,
    @Body('tier') tier: SubscriptionPlanTier,
  ) {
    return this.paymentsService.upgradePlan(tenantId, tier);
  }
}
