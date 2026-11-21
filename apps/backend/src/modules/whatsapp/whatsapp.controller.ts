import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { Public } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentTenantId } from '../../common/decorators/current-user.decorator';

@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  /**
   * Official Meta Webhook verification handshake
   */
  @Public()
  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    return this.whatsappService.verifyWebhook(mode, token, challenge);
  }

  /**
   * Official Meta Webhook receiver
   */
  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Body() payload: any,
    @Headers('x-hub-signature-256') signature?: string,
  ) {
    return this.whatsappService.processWebhookEvent(payload, signature);
  }

  /**
   * Interactive Simulator Endpoint
   * Allows frontend WhatsApp mobile mock to simulate an incoming customer message
   * and runs the complete real pipeline (Customer -> Conversation -> Message -> AI response).
   */
  @Public()
  @Post('simulate-incoming')
  @HttpCode(HttpStatus.OK)
  async simulateIncoming(
    @Body()
    body: {
      phone: string;
      name?: string;
      message: string;
      tenantId?: string;
    },
  ) {
    const mockMetaPayload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: '109283746501928',
          changes: [
            {
              value: {
                messaging_product: 'whatsapp',
                metadata: {
                  display_phone_number: '919820123456',
                  phone_number_id: '100000000000001',
                },
                contacts: [
                  {
                    profile: { name: body.name || 'WhatsApp Customer' },
                    wa_id: body.phone.replace('+', ''),
                  },
                ],
                messages: [
                  {
                    from: body.phone.replace('+', ''),
                    id: `wamid.SIMULATED_${Date.now()}`,
                    timestamp: Math.floor(Date.now() / 1000).toString(),
                    text: { body: body.message },
                    type: 'text',
                  },
                ],
              },
              field: 'messages',
            },
          ],
        },
      ],
    };

    return this.whatsappService.processWebhookEvent(mockMetaPayload);
  }

  /**
   * Retrieve conversation messages for WhatsApp simulator (public)
   */
  @Public()
  @Get('simulator/messages')
  async getSimulatorMessages(@Query('phone') phone: string) {
    return this.whatsappService.getSimulatorMessages(phone || '+919811223344');
  }

  /**
   * Reset conversation state for WhatsApp simulator (public)
   */
  @Public()
  @Post('simulator/reset')
  async resetSimulator(@Body() body: { phone?: string }) {
    return this.whatsappService.resetSimulator(body?.phone || '+919811223344');
  }

  /**
   * Manual message sending from business owner or employee dashboard
   */
  @UseGuards(JwtAuthGuard)
  @Post('send')
  async sendMessage(
    @CurrentTenantId() tenantId: string,
    @Body() body: { to: string; text: string },
  ) {
    return this.whatsappService.sendWhatsAppMessage(tenantId, body.to, body.text);
  }
}
