import { Test, TestingModule } from '@nestjs/testing';
import { WhatsAppService } from '../src/modules/whatsapp/whatsapp.service';
import { PrismaService } from '../src/database/prisma.service';

describe('WhatsApp & AI Service Integration Test', () => {
  let whatsappService: WhatsAppService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhatsAppService, PrismaService],
    }).compile();

    whatsappService = module.get<WhatsAppService>(WhatsAppService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should verify Meta webhook handshake challenge', () => {
    const challenge = 'random_challenge_12345';
    const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'nexaflow_meta_webhook_verify_token_99182';

    const result = whatsappService.verifyWebhook('subscribe', verifyToken, challenge);
    expect(result).toBe(challenge);
  });

  it('should process simulated incoming WhatsApp message and generate AI response', async () => {
    const tenant = await prisma.tenant.findFirst({ where: { status: 'ACTIVE' } });
    expect(tenant).toBeDefined();

    const result = await whatsappService.handleIncomingMessage(
      {
        from: '919811223344',
        id: `wamid.TEST_${Date.now()}`,
        type: 'text',
        text: { body: 'What are your clinic hours and address?' },
      },
      { profile: { name: 'Test Patient' } },
      tenant!.id,
    );

    expect(result).toBeDefined();
    expect(result?.customer.phone).toBe('+919811223344');
    expect(result?.conversation.id).toBeDefined();

    // Verify outbound AI message was created
    const aiMessage = await prisma.message.findFirst({
      where: {
        conversationId: result?.conversation.id,
        sender: 'AI',
      },
      orderBy: { createdAt: 'desc' },
    });

    expect(aiMessage).toBeDefined();
    expect(aiMessage?.content).toContain('open Monday to Saturday');
  });
});
