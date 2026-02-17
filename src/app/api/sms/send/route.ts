/**
 * POST /api/sms/send - Send SMS (e.g. journey update, OTP, fallback when no WhatsApp)
 * Body: { to: string, message: string }
 * Requires: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendSMS } from "@/lib/whatsapp/sender";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { to, message } = await req.json();
    if (!to || typeof to !== "string") {
      return NextResponse.json({ error: "Missing 'to' phone number" }, { status: 400 });
    }
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing 'message' text" }, { status: 400 });
    }

    const sent = await sendSMS(to, message.slice(0, 1600));
    if (!sent) {
      return NextResponse.json(
        { error: "SMS not sent. Check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: "SMS sent" });
  } catch (e) {
    console.error("SMS send error:", e);
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }
}
