/**
 * POST /api/voice/soap-note
 * Generate SOAP clinical note from voice transcript using Groq/Llama
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/wallet-service";
import Groq from "groq-sdk";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { transcript, patientId, journeyId } = await req.json();
    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }

    const key = process.env.GROQ_API_KEY;
    if (!key) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
    }

    const groq = new Groq({ apiKey: key });

    const prompt = `You are a medical scribe. Convert this doctor-patient consultation transcript into a structured SOAP note. Use clear, concise medical language.

Transcript:
"""
${transcript.slice(0, 6000)}
"""

Return a JSON object with exactly these keys (use empty string if not mentioned):
- chiefComplaint: string
- historyOfPresent: string (HPI, 2-4 sentences)
- examination: string (findings)
- diagnosis: string (or "Impression")
- plan: string (treatment plan, follow-up)
- medications: string (any medications mentioned)
- followUp: string

Return ONLY the JSON object, no markdown or extra text.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 1024,
    });

    const text = completion.choices[0]?.message?.content?.trim() || "";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    let parsed: Record<string, string>;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Failed to parse SOAP note" }, { status: 500 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 401 });

    const note = await prisma.clinicalNote.create({
      data: {
        doctorId: user.id,
        patientId: patientId || "",
        journeyId: journeyId || null,
        chiefComplaint: parsed.chiefComplaint ?? "",
        historyOfPresent: parsed.historyOfPresent ?? "",
        examination: parsed.examination ?? "",
        diagnosis: parsed.diagnosis ?? "",
        plan: parsed.plan ?? "",
        medications: parsed.medications ?? "",
        followUp: parsed.followUp ?? "",
        rawTranscript: transcript.slice(0, 10000),
        status: "draft",
        aiModelUsed: "llama-3.3-70b-versatile",
      },
    });

    return NextResponse.json({
      success: true,
      noteId: note.id,
      note: {
        chiefComplaint: note.chiefComplaint,
        historyOfPresent: note.historyOfPresent,
        examination: note.examination,
        diagnosis: note.diagnosis,
        plan: note.plan,
        medications: note.medications,
        followUp: note.followUp,
      },
    });
  } catch (e: any) {
    console.error("SOAP note error:", e);
    return NextResponse.json(
      { error: e.message || "Failed to generate SOAP note" },
      { status: 500 }
    );
  }
}
