export interface SimulatorAiResult {
  reply: string;
  handlingMode: 'AI' | 'HUMAN';
  quickActions?: string[];
}

export function generateSimulatorResponse(
  input: string,
  currentMode: 'AI' | 'HUMAN' = 'AI',
  customerName = 'Rohan Deshmukh',
): SimulatorAiResult {
  const lower = input.toLowerCase().trim();

  // 1. If currently in HUMAN mode, check for resume/restart
  if (currentMode === 'HUMAN') {
    if (
      lower.includes('restart') ||
      lower.includes('ai') ||
      lower.includes('resume') ||
      lower.includes('bot')
    ) {
      return {
        handlingMode: 'AI',
        reply: `🤖 *Automated AI Healthcare Assistant Resumed!*\n\nWelcome back, ${customerName}! I am online and ready to assist you with doctor schedules, appointment bookings, and payment inquiries.\n\nHow can I help you today?`,
        quickActions: [
          '📅 Book Appointment',
          '💰 Inquire Fees',
          '📍 Timings & Location',
          '🙋 Request Human',
        ],
      };
    }

    return {
      handlingMode: 'HUMAN',
      reply: `Your message has been received by our clinic front desk staff. Receptionist Sunita is reviewing your request. (Type *"restart"* or click below to return to automated AI booking mode).`,
      quickActions: ['🤖 Resume AI Mode'],
    };
  }

  // 2. Human Staff Handover Intent
  if (
    lower.includes('human') ||
    lower.includes('agent') ||
    lower.includes('person') ||
    lower.includes('reception') ||
    lower.includes('speak to doctor') ||
    lower.includes('talk to someone') ||
    lower.includes('urgent') ||
    lower.includes('call me')
  ) {
    return {
      handlingMode: 'HUMAN',
      reply: `🙋 *Handed Over to Live Front Desk Staff*\n\nI understand you would like to speak directly with our team. I have notified our front desk and assigned senior receptionist *Sunita* to your chat. An agent will respond shortly!\n\n(💡 Click *"Resume AI"* or type *"restart"* anytime to return to automated booking).`,
      quickActions: ['🤖 Resume AI Mode'],
    };
  }

  // 3. Slot Confirmation & Booking Completion
  if (
    lower.includes('11:00') ||
    lower.includes('11 am') ||
    lower.includes('11am') ||
    lower.includes('2:30') ||
    lower.includes('02:30') ||
    lower.includes('4:30') ||
    lower.includes('04:30') ||
    lower.includes('confirm') ||
    lower.includes('reserve') ||
    lower.includes('yes please') ||
    lower.includes('lock slot')
  ) {
    const slotChosen = lower.includes('2:30')
      ? 'Tomorrow at 02:30 PM'
      : lower.includes('4:30')
      ? 'Tomorrow at 04:30 PM'
      : 'Tomorrow at 11:00 AM';

    return {
      handlingMode: 'AI',
      reply: `🎉 *Appointment Successfully Confirmed!*\n\nYour consultation has been reserved in our clinic calendar:\n• *Patient*: ${customerName}\n• *Doctor*: Dr. Ananya Patel (Consultant Dermatologist)\n• *Department*: Dermatology & Skin Care Wing\n• *Slot*: ${slotChosen}\n• *Booking Ref*: #APT-2026-9812\n• *Consultation Fee*: ₹1,200 (Payable at clinic or online via UPI/Card)\n• *Status*: Confirmed & Slot Reserved\n• *Clinic Location*: Suite 402, Lotus Grandeur, Andheri West, Mumbai\n\nA confirmation SMS and calendar invite have been sent to your registered phone number.\n\n💳 Would you like an instant Razorpay UPI payment link to pre-pay, or directions to the clinic?`,
      quickActions: [
        '💳 Pay ₹1,200 Online',
        '📍 Clinic Location & Timings',
        '🙋 Request Human',
      ],
    };
  }

  // 4. Appointment Booking / Available Slots Inquiry
  if (
    lower.includes('book') ||
    lower.includes('appointment') ||
    lower.includes('opening') ||
    lower.includes('openings') ||
    lower.includes('slot') ||
    lower.includes('tomorrow') ||
    lower.includes('schedule') ||
    lower.includes('available') ||
    lower.includes('skin') ||
    lower.includes('derma') ||
    lower.includes('consultation')
  ) {
    return {
      handlingMode: 'AI',
      reply: `✨ *Apex Multispecialty Clinic — Appointment Booking*\n\nLed by *Dr. Ananya Patel* (Dermatology & Cosmetology), we have open consultation slots available tomorrow:\n\n• 🕚 *11:00 AM* — Morning Slot (Comprehensive Skin & Hair Evaluation)\n• 🕑 *02:30 PM* — Afternoon Slot\n• 🕟 *04:30 PM* — Evening Slot\n\nConsultation Fee: *₹1,200* (Includes in-person consultation, digital prescription & 7 days of follow-up care).\n\n👉 Please select your preferred time slot or reply with *"11:00 AM"* to confirm your booking:`,
      quickActions: [
        '🕚 Confirm 11:00 AM',
        '🕑 Confirm 02:30 PM',
        '🕟 Confirm 04:30 PM',
        '💰 Inquire Fees',
      ],
    };
  }

  // 5. Pricing, Charges, Payment & Invoicing
  if (
    lower.includes('pay') ||
    lower.includes('fee') ||
    lower.includes('charge') ||
    lower.includes('cost') ||
    lower.includes('price') ||
    lower.includes('upi') ||
    lower.includes('invoice') ||
    lower.includes('gst') ||
    lower.includes('bill') ||
    lower.includes('rate')
  ) {
    return {
      handlingMode: 'AI',
      reply: `💳 *Secure Razorpay & UPI Payment Link Generated*\n\n• *Invoice #*: INV-2026-APX-0104\n• *Consultation*: Dr. Ananya Patel (Dermatology)\n• *Subtotal*: ₹1,017\n• *GST (18%)*: ₹183\n• *Total Payable*: *₹1,200*\n\n👉 *Click here to complete payment securely via UPI (GPay, PhonePe, Paytm) or Card:*\n🔗 https://chatledger-ai.vercel.app/pay/13306de1-083c-4c34-b7b2-566f1203835b\n\nOfficial GST tax invoice and digital appointment pass will be delivered on WhatsApp automatically upon payment.`,
      quickActions: [
        '💳 Open Checkout Portal',
        '📅 Book Appointment',
        '📍 Timings & Location',
      ],
    };
  }

  // 6. Timings, Address & Location
  if (
    lower.includes('timing') ||
    lower.includes('hours') ||
    lower.includes('location') ||
    lower.includes('address') ||
    lower.includes('where') ||
    lower.includes('map') ||
    lower.includes('direction') ||
    lower.includes('open')
  ) {
    return {
      handlingMode: 'AI',
      reply: `📍 *Apex Multispecialty Clinic — Location & Timings:*\n\n• *Monday to Friday*: 9:00 AM – 8:00 PM\n• *Saturday*: 9:00 AM – 5:00 PM\n• *Sunday*: Closed (Emergency on-call)\n\n🏢 *Address*: Suite 402, Lotus Grandeur, Veera Desai Road, Andheri West, Mumbai 400053.\n🗺️ *Google Maps*: https://maps.google.com/?q=Apex+Clinic+Andheri\n📞 *Front Desk Phone*: +91 98201 23456\n\nWould you like me to book a consultation slot for you?`,
      quickActions: [
        '📅 Book Appointment',
        '💰 Inquire Fees',
        '🙋 Request Human',
      ],
    };
  }

  // 7. Doctors & Specialists
  if (
    lower.includes('doctor') ||
    lower.includes('dr') ||
    lower.includes('specialist') ||
    lower.includes('who') ||
    lower.includes('physician')
  ) {
    return {
      handlingMode: 'AI',
      reply: `👨‍⚕️ *Our Senior Medical Specialists:*\n\n• *Dr. Ramesh Sharma* — Senior General Physician (MD, 15+ years experience)\n• *Dr. Ananya Patel* — Consultant Dermatologist & Cosmetologist (DVD, FAAD)\n• *Dr. Vikram Mehta* — Specialist Pediatrician & Child Health\n\nAll specialists are available for in-clinic and priority consultations. Which doctor would you like to consult?`,
      quickActions: [
        '📅 Book Appointment',
        '💰 Inquire Fees',
        '📍 Timings & Location',
      ],
    };
  }

  // 8. General Greetings & Fallback
  return {
    handlingMode: 'AI',
    reply: `Hello ${customerName}! 👋 Welcome to *Apex Multispecialty Clinic*.\n\nI am your 24/7 AI Healthcare Operations Assistant. How may I assist you today?\n\n1️⃣ *Book an Appointment* (Type "book" or ask for tomorrow's slots)\n2️⃣ *Doctor Specialties & Consultations*\n3️⃣ *Consultation Fees & UPI Payments*\n4️⃣ *Clinic Timings & Google Maps Location*\n5️⃣ *Live Front Desk Staff Handover*`,
    quickActions: [
      '📅 Book Appointment',
      '💰 Inquire Fees',
      '📍 Timings & Location',
      '🙋 Request Human',
    ],
  };
}
