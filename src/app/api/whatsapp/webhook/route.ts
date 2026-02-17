/**
 * WhatsApp webhook - Twilio format
 * POST: incoming message (From, Body, MediaUrl0)
 * GET: optional verification (e.g. Meta hub.verify_token)
 */

import { NextRequest, NextResponse } from "next/server";
import { processWhatsAppMessage } from "@/lib/whatsapp/processor";
import { sendWhatsAppMessage } from "@/lib/whatsapp/sender";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let body: Record<string, any>;

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await req.formData();
      body = Object.fromEntries(form.entries());
    } else {
      body = await req.json();
    }

    // Twilio: From, Body, MediaUrl0 (and possibly NumMedia)
    const from = (body.From || body.from || "").replace("whatsapp:", "").trim();
    const text = (body.Body ?? body.body ?? "").trim();
    const mediaUrl = body.MediaUrl0 || body.mediaUrl0;

    if (!from) {
      return NextResponse.json({ error: "Missing From" }, { status: 400 });
    }

    let message = text;

    // If voice message and we had Whisper we could transcribe; for now treat as text
    if (mediaUrl && (mediaUrl.includes("audio") || body.NumMedia === "1")) {
      message = message || "[Voice message received. Reply with text: status, qr, help]";
    }

    const result = await processWhatsAppMessage({
      phone: from,
      message: message || "help",
      isVoice: false,
    });

    const sent = await sendWhatsAppMessage(from, result.text);
    if (!sent) {
      console.warn("WhatsApp send failed (check Twilio env). Reply would be:", result.text);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("WhatsApp webhook error:", e);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}

/** Meta/Facebook verification (GET hub.mode, hub.verify_token, hub.challenge) */
export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("hub.mode");
  const token = req.nextUrl.searchParams.get("hub.verify_token");
  const challenge = req.nextUrl.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}
