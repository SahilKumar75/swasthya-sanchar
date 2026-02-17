/**
 * GET /api/queue/predict?departmentId=xxx
 * Returns predicted wait time (minutes) for a department.
 * Uses QueueStatistics when available (same hour, same day of week), else fallback to department.avgServiceTime * currentQueue.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/wallet-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const departmentId = req.nextUrl.searchParams.get("departmentId");
    if (!departmentId) {
      return NextResponse.json({ error: "departmentId required" }, { status: 400 });
    }

    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      select: {
        id: true,
        code: true,
        hospitalId: true,
        avgServiceTime: true,
        currentQueue: true,
      },
    });

    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Prefer historical stats: same hour, same day of week (recent weeks)
    const stats = await prisma.queueStatistics.findMany({
      where: {
        hospitalId: department.hospitalId,
        departmentCode: department.code,
        hour,
        dayOfWeek,
        date: { gte: new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { date: "desc" },
      take: 10,
    });

    let predictedMinutes: number;
    let confidenceLow: number;
    let confidenceHigh: number;
    let source: "historical" | "rule";

    if (stats.length > 0) {
      const avg = stats.reduce((s, x) => s + x.avgWaitTime, 0) / stats.length;
      const mins = stats.map((x) => x.minWaitTime);
      const maxs = stats.map((x) => x.maxWaitTime);
      predictedMinutes = Math.round(avg);
      confidenceLow = Math.min(...mins);
      confidenceHigh = Math.max(...maxs);
      source = "historical";
    } else {
      // Rule: (currentQueue + 1) * avgServiceTime per patient ahead
      const queue = Math.max(0, department.currentQueue);
      predictedMinutes = (queue + 1) * department.avgServiceTime;
      confidenceLow = Math.max(5, Math.round(predictedMinutes * 0.6));
      confidenceHigh = Math.round(predictedMinutes * 1.5);
      source = "rule";
    }

    return NextResponse.json({
      departmentId,
      predictedMinutes,
      confidenceLow,
      confidenceHigh,
      source,
    });
  } catch (e) {
    console.error("Queue predict error:", e);
    return NextResponse.json({ error: "Prediction failed" }, { status: 500 });
  }
}
