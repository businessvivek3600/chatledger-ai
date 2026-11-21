import { PrismaClient, UserRole, IndustryType, SubscriptionPlanTier, SubscriptionStatus, ConversationStatus, HandlingMode, MessageType, MessageSender, MessageDeliveryStatus, LeadStage, LeadPriority, LeadSource, AppointmentStatus, TaskStatus, TaskPriority, AutomationTriggerType, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NexaFlow AI Database Seeding...');

  // 1. Clean existing records for clean idempotent seed
  await prisma.auditLog.deleteMany();
  await prisma.supportMessage.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.customerInvoice.deleteMany();
  await prisma.paymentRequest.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.workflowExecution.deleteMany();
  await prisma.automationWorkflow.deleteMany();
  await prisma.task.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.appointmentService.deleteMany();
  await prisma.knowledgeChunk.deleteMany();
  await prisma.knowledgeDocument.deleteMany();
  await prisma.aiUsageLog.deleteMany();
  await prisma.aiAssistant.deleteMany();
  await prisma.leadActivity.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.customerNote.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.whatsAppPhoneNumber.deleteMany();
  await prisma.whatsAppTemplate.deleteMany();
  await prisma.whatsAppAccount.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.tenantMember.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password123!', 10);
  const adminPasswordHash = await bcrypt.hash('AdminPassword123!', 10);

  // 2. Subscription Plans
  console.log('Creating Subscription Plans...');
  const plans = await Promise.all([
    prisma.subscriptionPlan.create({
      data: {
        name: 'Free Trial',
        tier: SubscriptionPlanTier.FREE_TRIAL,
        priceMonthly: 0,
        priceYearly: 0,
        isPopular: false,
        limits: {
          maxNumbers: 1,
          maxTeamMembers: 3,
          maxConversations: 250,
          maxTokens: 50000,
          maxAutomations: 3,
          maxContacts: 500,
          maxCampaigns: 1,
          maxStorageMb: 250,
        },
        features: [
          '1 WhatsApp Phone Number',
          '3 Team Members',
          '250 AI Conversations / month',
          'Pre-built Appointment Engine',
          'Basic Visual Automation (3 workflows)',
          'Shared Team Inbox',
          '14-Day Free Access',
        ],
      },
    }),
    prisma.subscriptionPlan.create({
      data: {
        name: 'Starter',
        tier: SubscriptionPlanTier.STARTER,
        priceMonthly: 1999,
        priceYearly: 19990,
        isPopular: false,
        limits: {
          maxNumbers: 1,
          maxTeamMembers: 5,
          maxConversations: 2000,
          maxTokens: 500000,
          maxAutomations: 10,
          maxContacts: 2500,
          maxCampaigns: 10,
          maxStorageMb: 1000,
        },
        features: [
          'Official WhatsApp Cloud API',
          '5 Team Seats',
          '2,000 AI Conversations / month',
          'Full CRM & Lead Pipeline',
          'Automated Appointment Booking',
          '10 Active Automations',
          'Razorpay Payment Link Generator',
          'Standard Support',
        ],
      },
    }),
    prisma.subscriptionPlan.create({
      data: {
        name: 'Growth',
        tier: SubscriptionPlanTier.GROWTH,
        priceMonthly: 4999,
        priceYearly: 49990,
        isPopular: true,
        limits: {
          maxNumbers: 2,
          maxTeamMembers: 15,
          maxConversations: 10000,
          maxTokens: 2000000,
          maxAutomations: 25,
          maxContacts: 10000,
          maxCampaigns: 50,
          maxStorageMb: 5000,
        },
        features: [
          '2 WhatsApp Numbers',
          '15 Team Seats',
          '10,000 AI Conversations / month',
          'Custom RAG Knowledge Base (PDF, FAQs, Web)',
          'Visual Workflow Drag-and-Drop Builder',
          'Bulk WhatsApp Campaigns with Templates',
          'Multi-Agent Routing & Human Handover',
          'Priority WhatsApp Webhook Processing',
          'GST Compliant Invoicing',
        ],
      },
    }),
    prisma.subscriptionPlan.create({
      data: {
        name: 'Professional',
        tier: SubscriptionPlanTier.PROFESSIONAL,
        priceMonthly: 9999,
        priceYearly: 99990,
        isPopular: false,
        limits: {
          maxNumbers: 5,
          maxTeamMembers: 35,
          maxConversations: 35000,
          maxTokens: 8000000,
          maxAutomations: 100,
          maxContacts: 50000,
          maxCampaigns: 200,
          maxStorageMb: 20000,
        },
        features: [
          '5 WhatsApp Phone Numbers',
          '35 Team Seats',
          '35,000 AI Conversations / month',
          'Advanced Intent Classification & Tool Calling',
          'Custom Webhooks & Google Calendar Sync',
          'Unlimited Visual Automations',
          'Dedicated Account Manager',
          '99.9% Uptime SLA',
        ],
      },
    }),
    prisma.subscriptionPlan.create({
      data: {
        name: 'Enterprise',
        tier: SubscriptionPlanTier.ENTERPRISE,
        priceMonthly: 24999,
        priceYearly: 249990,
        isPopular: false,
        limits: {
          maxNumbers: 20,
          maxTeamMembers: 150,
          maxConversations: 150000,
          maxTokens: 30000000,
          maxAutomations: 500,
          maxContacts: 250000,
          maxCampaigns: 1000,
          maxStorageMb: 100000,
        },
        features: [
          'Unlimited WhatsApp Numbers',
          'Unlimited Team Members',
          'Custom Dedicated AI Models & Fine-tuning',
          'Custom ERP/CRM Integrations',
          'Enterprise Single Sign-On (SSO)',
          'Dedicated Solutions Architect',
          'Custom Legal Agreements & Data Residency',
        ],
      },
    }),
  ]);

  const growthPlan = plans.find((p) => p.tier === SubscriptionPlanTier.GROWTH)!;

  // 3. Platform Super Admin User
  console.log('Creating Super Admin User...');
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@nexaflow.ai',
      passwordHash: adminPasswordHash,
      fullName: 'Vikramaditya Roy',
      phone: '+919876500001',
      role: UserRole.SUPER_ADMIN,
      isEmailVerified: true,
      isPhoneVerified: true,
      status: 'ACTIVE',
    },
  });

  // 4. Tenant 1: Apex Multispecialty Clinic
  console.log('Creating Apex Multispecialty Clinic Tenant...');
  const clinicOwner = await prisma.user.create({
    data: {
      email: 'doctor.sharma@apexclinic.com',
      passwordHash,
      fullName: 'Dr. Rajesh Sharma',
      phone: '+919820123456',
      role: UserRole.BUSINESS_OWNER,
      isEmailVerified: true,
      isPhoneVerified: true,
      status: 'ACTIVE',
    },
  });

  const clinicTenant = await prisma.tenant.create({
    data: {
      name: 'Apex Multispecialty Clinic',
      slug: 'apex-clinic',
      industry: IndustryType.CLINIC,
      phone: '+919820123456',
      email: 'contact@apexclinic.com',
      address: 'Suite 402, Lotus Grandeur, Veera Desai Road, Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'IN',
      pincode: '400053',
      gstin: '27AABCA1234M1Z5',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      status: 'ACTIVE',
      workingHours: {
        days: [1, 2, 3, 4, 5, 6], // Mon-Sat
        start: '09:00',
        end: '20:00',
      },
    },
  });

  // Assign Owner Membership
  await prisma.tenantMember.create({
    data: {
      tenantId: clinicTenant.id,
      userId: clinicOwner.id,
      role: UserRole.BUSINESS_OWNER,
      isOwner: true,
      permissions: ['*'],
    },
  });

  // Assign Growth Plan Subscription to Clinic
  await prisma.subscription.create({
    data: {
      tenantId: clinicTenant.id,
      planId: growthPlan.id,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Employees for Clinic
  const receptionistUser = await prisma.user.create({
    data: {
      email: 'reception@apexclinic.com',
      passwordHash,
      fullName: 'Pooja Verma',
      phone: '+919820123457',
      role: UserRole.APPOINTMENT_MANAGER,
      isEmailVerified: true,
      status: 'ACTIVE',
    },
  });

  await prisma.tenantMember.create({
    data: {
      tenantId: clinicTenant.id,
      userId: receptionistUser.id,
      role: UserRole.APPOINTMENT_MANAGER,
      permissions: [
        'view_all_conversations',
        'send_messages',
        'manage_appointments',
        'view_appointments',
        'manage_customers',
        'manage_tasks',
      ],
    },
  });

  const supportUser = await prisma.user.create({
    data: {
      email: 'support@apexclinic.com',
      passwordHash,
      fullName: 'Amit Saxena',
      phone: '+919820123458',
      role: UserRole.CUSTOMER_SUPPORT,
      isEmailVerified: true,
      status: 'ACTIVE',
    },
  });

  await prisma.tenantMember.create({
    data: {
      tenantId: clinicTenant.id,
      userId: supportUser.id,
      role: UserRole.CUSTOMER_SUPPORT,
      permissions: [
        'view_assigned_conversations',
        'send_messages',
        'view_customers',
        'manage_tasks',
      ],
    },
  });

  // 5. WhatsApp Account & Number for Clinic
  const whatsappAccount = await prisma.whatsAppAccount.create({
    data: {
      tenantId: clinicTenant.id,
      wabaId: '109283746501928',
      name: 'Apex Clinic WhatsApp Official',
      status: 'CONNECTED',
      webhookVerifyToken: 'apex_wh_verify_token_99182',
    },
  });

  await prisma.whatsAppPhoneNumber.create({
    data: {
      accountId: whatsappAccount.id,
      phoneNumberId: '100000000000001',
      displayPhoneNumber: '+91 98201 23456',
      verifiedName: 'Apex Multispecialty Clinic',
      qualityRating: 'GREEN',
      codeVerificationStatus: 'VERIFIED',
      isDefault: true,
      status: 'ACTIVE',
    },
  });

  // WhatsApp Templates
  await prisma.whatsAppTemplate.createMany({
    data: [
      {
        accountId: whatsappAccount.id,
        name: 'appointment_confirmation_v1',
        category: 'UTILITY',
        language: 'en',
        components: {
          header: { type: 'TEXT', text: 'Appointment Confirmed' },
          body: { text: 'Hello {{1}}, your appointment for {{2}} with Dr. {{3}} is confirmed for {{4}} at {{5}}. Location: {{6}}.' },
          buttons: [{ type: 'QUICK_REPLY', text: 'Reschedule' }, { type: 'QUICK_REPLY', text: 'Directions' }],
        },
        status: 'APPROVED',
      },
      {
        accountId: whatsappAccount.id,
        name: 'payment_receipt_notice',
        category: 'UTILITY',
        language: 'en',
        components: {
          header: { type: 'TEXT', text: 'Payment Successful' },
          body: { text: 'Thank you {{1}}! We have received your payment of ₹{{2}} for Invoice #{{3}}. Download your GST receipt here: {{4}}' },
        },
        status: 'APPROVED',
      },
    ],
  });

  // 6. AI Assistant for Apex Clinic
  console.log('Configuring AI Assistant for Clinic...');
  await prisma.aiAssistant.create({
    data: {
      tenantId: clinicTenant.id,
      name: 'Dr. Apex AI',
      personality: 'Compassionate, clinical yet warm, highly articulate, patient-focused, and precise.',
      language: 'English, Hindi, Hinglish',
      tone: 'Warm Professional & Reassuring',
      businessIntro: 'Apex Multispecialty Clinic is Andheri West premier medical center specializing in General Medicine, Dermatology, Cardiology Consultations, and Dental Care with experienced MD specialists.',
      productsServices: [
        { name: 'General Physician Consultation', price: 800, duration: 30, doctor: 'Dr. Rajesh Sharma, MD' },
        { name: 'Dermatology & Skin Clinic', price: 1200, duration: 30, doctor: 'Dr. Ananya Roy, MD Dermatology' },
        { name: 'Dental Cleaning & Consultation', price: 1000, duration: 45, doctor: 'Dr. Kunal Mehta, MDS' },
        { name: 'Executive Preventive Health Checkup', price: 3500, duration: 60, doctor: 'Panel of Specialists' },
      ],
      pricingInfo: {
        consultationFeeRange: '₹800 to ₹1,500',
        paymentModes: 'UPI, Credit/Debit Cards, Cash, Net Banking via Razorpay',
        discounts: '10% off on follow-up visit within 7 days',
      },
      businessHours: {
        mon_fri: '9:00 AM - 8:00 PM',
        saturday: '9:00 AM - 5:00 PM',
        sunday: 'Emergency and prior appointments only',
      },
      contactDetails: {
        phone: '+91 98201 23456',
        emergencyHelpline: '+91 98201 99999',
        address: 'Suite 402, Lotus Grandeur, Veera Desai Road, Andheri West, Mumbai',
        googleMaps: 'https://maps.google.com/?q=Apex+Clinic+Andheri',
      },
      appointmentRules: {
        advanceNoticeHours: 2,
        cancellationWindowHours: 4,
        reschedulingAllowed: true,
      },
      escalationRules: {
        emergencySymptoms: ['severe chest pain', 'unconsciousness', 'heavy bleeding', 'severe trauma'],
        action: 'Direct to 108 ambulance & emergency helpline immediately and notify Dr. Sharma.',
      },
      handoverConditions: {
        frustratedCustomer: true,
        complexMedicalHistory: true,
        directHumanRequestKeywords: ['human', 'agent', 'speak to doctor', 'call me'],
      },
      isEnabled: true,
      model: 'gpt-4o-mini',
      temperature: 0.3,
      maxTokensPerResponse: 350,
    },
  });

  // 7. Appointment Services & Availability Slots
  console.log('Creating Clinic Appointment Services & Slots...');
  const generalService = await prisma.appointmentService.create({
    data: {
      tenantId: clinicTenant.id,
      name: 'General Physician Consultation',
      description: 'Comprehensive health diagnosis, prescription review, and vitals assessment.',
      durationMinutes: 30,
      price: 800,
      currency: 'INR',
      isActive: true,
    },
  });

  const dermaService = await prisma.appointmentService.create({
    data: {
      tenantId: clinicTenant.id,
      name: 'Dermatology & Skin Clinic',
      description: 'Acne, pigmentation, allergies, hair-fall treatment, and skin analysis.',
      durationMinutes: 30,
      price: 1200,
      currency: 'INR',
      isActive: true,
    },
  });

  // Availability slots Mon-Sat 9:00 to 18:00
  for (let day = 1; day <= 6; day++) {
    await prisma.availabilitySlot.create({
      data: {
        tenantId: clinicTenant.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '18:00',
      },
    });
  }

  // 8. Knowledge Base Documents & Chunks
  console.log('Indexing Knowledge Base...');
  const clinicFaqDoc = await prisma.knowledgeDocument.create({
    data: {
      tenantId: clinicTenant.id,
      title: 'Clinic FAQs & Patient Guide 2026',
      docType: 'FAQ',
      status: 'INDEXED',
      chunkCount: 3,
      rawText: `
Q: What are your consulting timings?
A: Monday to Friday 9:00 AM to 8:00 PM, Saturday 9:00 AM to 5:00 PM. We are closed for general OPD on Sundays.

Q: Do I need to book in advance?
A: Prior appointments are recommended to minimize waiting time. Walk-in slots are subject to doctor availability.

Q: How do I reschedule or cancel my appointment?
A: You can reschedule anytime up to 4 hours before your slot right here in WhatsApp by asking our AI assistant.

Q: Do you offer telemedicine / video consultations?
A: Yes, tele-consultation is available for follow-ups via secure Google Meet / WhatsApp Video after prior booking.
      `,
    },
  });

  await prisma.knowledgeChunk.createMany({
    data: [
      {
        documentId: clinicFaqDoc.id,
        tenantId: clinicTenant.id,
        chunkIndex: 0,
        content: 'Clinic Timings: Monday to Friday 9:00 AM to 8:00 PM, Saturday 9:00 AM to 5:00 PM. Closed Sundays. Prior appointments recommended.',
        tokenCount: 32,
      },
      {
        documentId: clinicFaqDoc.id,
        tenantId: clinicTenant.id,
        chunkIndex: 1,
        content: 'Appointment Rescheduling & Cancellation: Allowed anytime up to 4 hours in advance via WhatsApp assistant or dashboard.',
        tokenCount: 24,
      },
      {
        documentId: clinicFaqDoc.id,
        tenantId: clinicTenant.id,
        chunkIndex: 2,
        content: 'Services: General Physician (₹800), Dermatology (₹1,200), Dental Care (₹1,000), Executive Full Body Checkup (₹3,500). Payment via UPI, Cards, Razorpay.',
        tokenCount: 38,
      },
    ],
  });

  // 9. Customers & Conversations (Shared Team Inbox Data)
  console.log('Creating Customers and Conversations...');
  const customer1 = await prisma.customer.create({
    data: {
      tenantId: clinicTenant.id,
      name: 'Rohan Deshmukh',
      phone: '+919819283741',
      email: 'rohan.d@gmail.com',
      city: 'Mumbai',
      state: 'Maharashtra',
      type: 'REGULAR',
      lifetimeValue: 2400,
      totalPurchases: 2,
      lastInteractionAt: new Date(),
      tags: ['follow-up-needed', 'dermatology'],
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      tenantId: clinicTenant.id,
      name: 'Sunita Menon',
      phone: '+919833445566',
      email: 'sunita.m@outlook.com',
      city: 'Mumbai',
      state: 'Maharashtra',
      type: 'VIP',
      lifetimeValue: 4300,
      totalPurchases: 3,
      lastInteractionAt: new Date(),
      tags: ['vip-patient', 'hypertension'],
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      tenantId: clinicTenant.id,
      name: 'Karan Malhotra',
      phone: '+919876543210',
      email: 'karan@malhotra.in',
      city: 'Thane',
      state: 'Maharashtra',
      type: 'REGULAR',
      lifetimeValue: 0,
      totalPurchases: 0,
      lastInteractionAt: new Date(),
      tags: ['new-inquiry', 'general-checkup'],
    },
  });

  // Conversation 1: Rohan Deshmukh (AI Handled)
  const conv1 = await prisma.conversation.create({
    data: {
      tenantId: clinicTenant.id,
      customerId: customer1.id,
      status: ConversationStatus.OPEN,
      handlingMode: HandlingMode.AI,
      lastMessageAt: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
      unreadCount: 0,
      summary: 'Patient inquired about Dr. Ananya Roy skin consultation slots for tomorrow.',
    },
  });

  await prisma.message.createMany({
    data: [
      {
        tenantId: clinicTenant.id,
        conversationId: conv1.id,
        sender: MessageSender.CUSTOMER,
        messageType: MessageType.TEXT,
        content: 'Hi, does Dr. Ananya have any open slots tomorrow afternoon for acne treatment?',
        deliveryStatus: MessageDeliveryStatus.READ,
        createdAt: new Date(Date.now() - 6 * 60 * 1000),
      },
      {
        tenantId: clinicTenant.id,
        conversationId: conv1.id,
        sender: MessageSender.AI,
        messageType: MessageType.TEXT,
        content: 'Hello Rohan! Yes, Dr. Ananya Roy (Dermatologist) has openings tomorrow (Saturday) at 2:30 PM, 3:30 PM, and 4:15 PM. The consultation fee is ₹1,200. Would you like me to book any of these slots for you?',
        deliveryStatus: MessageDeliveryStatus.DELIVERED,
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
      },
    ],
  });

  // Conversation 2: Sunita Menon (Human Handled - Assigned to Receptionist)
  const conv2 = await prisma.conversation.create({
    data: {
      tenantId: clinicTenant.id,
      customerId: customer2.id,
      assignedUserId: receptionistUser.id,
      status: ConversationStatus.PENDING,
      handlingMode: HandlingMode.HUMAN,
      lastMessageAt: new Date(Date.now() - 25 * 60 * 1000),
      unreadCount: 1,
      summary: 'VIP patient requested custom blood panel invoice and medical certificate.',
    },
  });

  await prisma.message.createMany({
    data: [
      {
        tenantId: clinicTenant.id,
        conversationId: conv2.id,
        sender: MessageSender.CUSTOMER,
        messageType: MessageType.TEXT,
        content: 'Good morning Pooja, could you send the PDF receipt for yesterday blood tests? My insurance claim requires it.',
        deliveryStatus: MessageDeliveryStatus.READ,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        tenantId: clinicTenant.id,
        conversationId: conv2.id,
        sender: MessageSender.AGENT,
        senderUserId: receptionistUser.id,
        messageType: MessageType.TEXT,
        content: 'Good morning Mrs. Menon! Absolutely, preparing your GST invoice right away. I will share the official download link here in a moment.',
        deliveryStatus: MessageDeliveryStatus.READ,
        createdAt: new Date(Date.now() - 25 * 60 * 1000),
      },
    ],
  });

  // 10. Leads & Pipeline
  console.log('Populating CRM Leads...');
  await prisma.lead.createMany({
    data: [
      {
        tenantId: clinicTenant.id,
        customerId: customer1.id,
        name: 'Rohan Deshmukh',
        phone: '+919819283741',
        email: 'rohan.d@gmail.com',
        stage: LeadStage.INTERESTED,
        priority: LeadPriority.HIGH,
        source: LeadSource.WHATSAPP,
        budget: 2500,
        interestedService: 'Dermatology & Skin Clinic',
        requirements: 'Acne scar treatment inquiry for 3 sessions',
        assignedUserId: receptionistUser.id,
        score: 75,
        nextFollowUpAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      {
        tenantId: clinicTenant.id,
        customerId: customer3.id,
        name: 'Karan Malhotra',
        phone: '+919876543210',
        email: 'karan@malhotra.in',
        stage: LeadStage.QUALIFIED,
        priority: LeadPriority.MEDIUM,
        source: LeadSource.WEBSITE,
        budget: 3500,
        interestedService: 'Executive Preventive Health Checkup',
        requirements: 'Annual corporate health checkup for senior citizen parents',
        assignedUserId: receptionistUser.id,
        score: 65,
        nextFollowUpAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
      },
      {
        tenantId: clinicTenant.id,
        name: 'Dr. Vivek Singhal',
        phone: '+919811223344',
        email: 'vivek@singhaltech.com',
        stage: LeadStage.PROPOSAL_SENT,
        priority: LeadPriority.URGENT,
        source: LeadSource.REFERRAL,
        budget: 45000,
        interestedService: 'Corporate Wellness Package',
        requirements: 'Annual health checkup camp for 50 software engineers',
        assignedUserId: clinicOwner.id,
        score: 90,
        nextFollowUpAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      },
    ],
  });

  // 11. Appointments
  console.log('Creating Confirmed Appointments...');
  const tomorrowSlot = new Date();
  tomorrowSlot.setDate(tomorrowSlot.getDate() + 1);
  tomorrowSlot.setHours(11, 0, 0, 0);

  const tomorrowSlotEnd = new Date(tomorrowSlot);
  tomorrowSlotEnd.setMinutes(tomorrowSlotEnd.getMinutes() + 30);

  await prisma.appointment.create({
    data: {
      tenantId: clinicTenant.id,
      customerId: customer1.id,
      serviceId: dermaService.id,
      assignedUserId: receptionistUser.id,
      scheduledAt: tomorrowSlot,
      endAt: tomorrowSlotEnd,
      durationMinutes: 30,
      status: AppointmentStatus.CONFIRMED,
      notes: 'Initial skin evaluation with Dr. Ananya Roy',
      location: 'Consultation Room 2',
    },
  });

  const nextWeekSlot = new Date();
  nextWeekSlot.setDate(nextWeekSlot.getDate() + 3);
  nextWeekSlot.setHours(16, 30, 0, 0);

  const nextWeekSlotEnd = new Date(nextWeekSlot);
  nextWeekSlotEnd.setMinutes(nextWeekSlotEnd.getMinutes() + 30);

  await prisma.appointment.create({
    data: {
      tenantId: clinicTenant.id,
      customerId: customer2.id,
      serviceId: generalService.id,
      assignedUserId: clinicOwner.id,
      scheduledAt: nextWeekSlot,
      endAt: nextWeekSlotEnd,
      durationMinutes: 30,
      status: AppointmentStatus.CONFIRMED,
      notes: 'Hypertension routine 3-month follow-up',
      location: 'Dr. Sharma Office (Room 1)',
    },
  });

  // 12. Visual Automation Workflow
  console.log('Creating Visual Automation Workflow...');
  await prisma.automationWorkflow.create({
    data: {
      tenantId: clinicTenant.id,
      name: 'New WhatsApp Lead Welcome & Service Catalog',
      description: 'When an unknown customer messages on WhatsApp, create a CRM Lead, trigger welcome message, and notify reception.',
      triggerType: AutomationTriggerType.NEW_MESSAGE,
      isActive: true,
      executionCount: 142,
      definition: {
        nodes: [
          { id: '1', type: 'trigger', label: 'Trigger: New WhatsApp Message', config: { channel: 'WHATSAPP' } },
          { id: '2', type: 'condition', label: 'Check: Is Existing Customer?', config: { field: 'isRegisteredCustomer', operator: 'equals', value: false } },
          { id: '3', type: 'action', label: 'Action: Create CRM Lead in "NEW" Stage', config: { stage: 'NEW', priority: 'MEDIUM' } },
          { id: '4', type: 'action', label: 'Action: AI Personalized Introduction', config: { tone: 'warm' } },
          { id: '5', type: 'action', label: 'Action: Notify Front Desk WhatsApp', config: { recipientRole: 'APPOINTMENT_MANAGER' } },
        ],
        edges: [
          { source: '1', target: '2' },
          { source: '2', target: '3', condition: 'true' },
          { source: '3', target: '4' },
          { source: '4', target: '5' },
        ],
      },
    },
  });

  // 13. Payment Requests & Invoices
  console.log('Generating Payment Requests & GST Invoices...');
  const payReq = await prisma.paymentRequest.create({
    data: {
      tenantId: clinicTenant.id,
      customerId: customer2.id,
      amount: 1416, // ₹1,200 + 18% GST = ₹1,416
      currency: 'INR',
      description: 'Consultation & Comprehensive Blood Panel for Sunita Menon',
      invoiceNumber: 'INV-2026-APX-0104',
      razorpayPaymentLink: 'http://localhost:3000/pay/apex_demo_pay',
      status: PaymentStatus.PAID,
      paidAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  });

  await prisma.customerInvoice.create({
    data: {
      tenantId: clinicTenant.id,
      customerId: customer2.id,
      paymentRequestId: payReq.id,
      invoiceNumber: 'INV-2026-APX-0104',
      subtotal: 1200,
      taxGst: 216,
      totalAmount: 1416,
      currency: 'INR',
      status: 'PAID',
      items: [
        { description: 'Specialist Consultation with Dr. Rajesh Sharma', qty: 1, unitPrice: 800, amount: 800 },
        { description: 'Routine Vitals & ECG Quick Screen', qty: 1, unitPrice: 400, amount: 400 },
      ],
    },
  });

  // 14. Tasks & Follow-ups
  console.log('Creating Tasks...');
  await prisma.task.createMany({
    data: [
      {
        tenantId: clinicTenant.id,
        customerId: customer1.id,
        assignedUserId: receptionistUser.id,
        title: 'Confirm tomorrow acne consultation slot with Rohan',
        description: 'Check if patient has prior prescriptions or allergies before arrival.',
        priority: TaskPriority.HIGH,
        status: TaskStatus.IN_PROGRESS,
        dueDate: tomorrowSlot,
      },
      {
        tenantId: clinicTenant.id,
        customerId: customer3.id,
        assignedUserId: receptionistUser.id,
        title: 'Follow-up on Corporate Executive Health checkup quote',
        description: 'Customer requested discount structure for parents over 65 years.',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.PENDING,
        dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
      },
    ],
  });

  // 15. Super Admin Support Tickets & Platform Logs
  console.log('Generating Super Admin Support Tickets & Audit Logs...');
  await prisma.supportTicket.create({
    data: {
      tenantId: clinicTenant.id,
      userId: clinicOwner.id,
      subject: 'WhatsApp Cloud API Embedded Signup Webhook Verification',
      category: 'WHATSAPP_API',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      assignedAdminId: superAdmin.id,
    },
  });

  await prisma.auditLog.createMany({
    data: [
      {
        tenantId: clinicTenant.id,
        userId: clinicOwner.id,
        action: 'TENANT_ONBOARDING_COMPLETED',
        entity: 'Tenant',
        entityId: clinicTenant.id,
        details: { industry: 'CLINIC', initialPlan: 'GROWTH' },
      },
      {
        tenantId: clinicTenant.id,
        userId: receptionistUser.id,
        action: 'APPOINTMENT_SCHEDULED',
        entity: 'Appointment',
        details: { patient: 'Rohan Deshmukh', service: 'Dermatology' },
      },
    ],
  });

  console.log('✅ NexaFlow AI Seed Completed Successfully!');
  console.log('--------------------------------------------------');
  console.log('🔐 Super Admin: admin@nexaflow.ai / AdminPassword123!');
  console.log('🏥 Business Owner (Clinic): doctor.sharma@apexclinic.com / Password123!');
  console.log('👩‍⚕️ Employee (Reception): reception@apexclinic.com / Password123!');
  console.log('🧑‍💻 Employee (Support): support@apexclinic.com / Password123!');
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
