/**
 * Hospital Journeys API
 * GET - Get all active journeys for a hospital
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/wallet-service";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'active';

    const journeys = await prisma.patientJourney.findMany({
      where: {
        hospitalId: params.id,
        ...(status !== 'all' ? { status } : {})
      },
      include: {
        patient: {
          select: {
            fullName: true,
            phone: true
          }
        },
        checkpoints: {
          where: {
            status: {
              in: ['in_queue', 'in_progress']
            }
          },
          include: {
            department: {
              select: {
                name: true,
                code: true,
                floor: true,
                wing: true
              }
            }
          },
          orderBy: { sequence: 'asc' },
          take: 1
        }
      },
      orderBy: { startedAt: 'desc' }
    });

    // Map currentCheckpoint
    const journeysWithCurrent = journeys.map(journey => ({
      ...journey,
      currentCheckpoint: journey.checkpoints[0] || null
    }));

    return NextResponse.json({ journeys: journeysWithCurrent });

  } catch (error) {
    console.error('Hospital journeys fetch error:', error);
    return NextResponse.json({ error: "Failed to fetch journeys" }, { status: 500 });
  }
}
