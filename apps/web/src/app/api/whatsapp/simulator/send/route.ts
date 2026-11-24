import { NextRequest, NextResponse } from 'next/server';
import { generateSimulatorResponse } from '../../../../../lib/simulatorLogic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = body?.text || '';
    const customerName = body?.customerName || 'Rohan Deshmukh';
    const currentMode = body?.handlingMode || 'AI';

    const result = generateSimulatorResponse(text, currentMode, customerName);

    return NextResponse.json({
      success: true,
      data: {
        reply: result.reply,
        handlingMode: result.handlingMode,
        quickActions: result.quickActions,
        timestamp: new Date().toISOString(),
      },
      reply: result.reply,
      handlingMode: result.handlingMode,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Simulator send failed',
      },
      { status: 500 },
    );
  }
}
