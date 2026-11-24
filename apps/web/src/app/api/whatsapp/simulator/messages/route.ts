import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    data: {
      handlingMode: 'AI',
      messages: [
        {
          id: 'msg_welcome_seed',
          sender: 'AI',
          content: 'Hello Rohan! Welcome to Apex Multispecialty Clinic. How can we assist you with doctor schedules, appointment bookings, or clinic timings today?',
          createdAt: new Date().toISOString(),
        },
      ],
    },
  });
}
