/**
 * POST /api/queue/stats/log - Log queue statistics for a department (hourly bucket).
 * Body: { hospitalId, departmentCode, avgWaitTime, maxWaitTime, minWaitTime, totalPatients, avgServiceTime }
 * Used by cron or when checkpoint batches complete to feed wait-time prediction.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/wallet-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      hospitalId,
      departmentCode,
      avgWaitTime,
      maxWaitTime,
      minWaitTime,
      totalPatients,
      avgServiceTime,
      weatherCondition,
      isHoliday,
      specialEvents,
    } = body;

    if (!hospitalId || !departmentCode || avgWaitTime == null) {
      return NextResponse.json(
        { error: "hospitalId, departmentCode, avgWaitTime required" },
        { status: 400 }
      );
    }

    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    await prisma.queueStatistics.upsert({
      where: {
        hospitalId_departmentCode_date_hour: {
          hospitalId,
          departmentCode,
          date,
          hour,
        },
      },
      create: {
        hospitalId,
        departmentCode,
        date,
        hour,
        dayOfWeek,
        avgWaitTime: Number(avgWaitTime),
        maxWaitTime: Number(maxWaitTime ?? avgWaitTime),
        minWaitTime: Number(minWaitTime ?? avgWaitTime),
        totalPatients: Number(totalPatients ?? 1),
        avgServiceTime: Number(avgServiceTime ?? 15),
        weatherCondition: weatherCondition ?? null,
        isHoliday: Boolean(isHoliday),
        specialEvents: specialEvents ?? null,
      },
      update: {
        avgWaitTime: Number(avgWaitTime),
        maxWaitTime: Number(maxWaitTime ?? avgWaitTime),
        minWaitTime: Number(minWaitTime ?? avgWaitTime),
        totalPatients: Number(totalPatients ?? 1),
        avgServiceTime: Number(avgServiceTime ?? 15),
        weatherCondition: weatherCondition ?? null,
        isHoliday: Boolean(isHoliday),
        specialEvents: specialEvents ?? null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Queue stats log error:", e);
    return NextResponse.json({ error: "Log failed" }, { status: 500 });
  }
}
