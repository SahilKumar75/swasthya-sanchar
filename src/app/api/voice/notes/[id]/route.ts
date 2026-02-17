/**
 * GET /api/voice/notes/[id] - Get single clinical note
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/wallet-service";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 401 });

    const note = await prisma.clinicalNote.findFirst({
      where: { id: params.id, doctorId: user.id },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({
      note: {
        id: note.id,
        chiefComplaint: note.chiefComplaint,
        historyOfPresent: note.historyOfPresent,
        examination: note.examination,
        diagnosis: note.diagnosis,
        plan: note.plan,
        medications: note.medications,
        followUp: note.followUp,
        rawTranscript: note.rawTranscript,
        status: note.status,
        createdAt: note.createdAt,
      },
    });
  } catch (e) {
    console.error("Voice note get error:", e);
    return NextResponse.json({ error: "Failed to get note" }, { status: 500 });
  }
}
