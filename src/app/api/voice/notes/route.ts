/**
 * GET /api/voice/notes - List clinical notes for current doctor
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/wallet-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
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

    const notes = await prisma.clinicalNote.findMany({
      where: { doctorId: user.id },
      select: {
        id: true,
        chiefComplaint: true,
        diagnosis: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ notes });
  } catch (e) {
    console.error("Voice notes list error:", e);
    return NextResponse.json({ error: "Failed to list notes" }, { status: 500 });
  }
}
