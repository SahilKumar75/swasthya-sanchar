/**
 * Journey API - List and Create Patient Journeys
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/wallet-service";

// GET - List journeys for current patient
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { patientProfile: true }
    });

    if (!user?.patientProfile) {
      return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // active, completed, all
    
    const journeys = await prisma.patientJourney.findMany({
      where: {
        patientId: user.patientProfile.id,
        ...(status && status !== 'all' ? { status } : {})
      },
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true
          }
        },
        checkpoints: {
          include: {
            department: {
              select: {
                id: true,
                name: true,
                code: true,
                type: true,
                icon: true,
                color: true,
                floor: true,
                wing: true
              }
            }
          },
          orderBy: { sequence: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json({ journeys });

  } catch (error) {
    console.error('Journey list error:', error);
    return NextResponse.json({ error: "Failed to fetch journeys" }, { status: 500 });
  }
}

// POST - Start a new journey
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { patientProfile: true }
    });

    if (!user?.patientProfile) {
      return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const { hospitalId, visitType, chiefComplaint, departmentIds } = body;

    if (!hospitalId) {
      return NextResponse.json({ error: "Hospital ID is required" }, { status: 400 });
    }

    // Get hospital
    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
      include: {
        departments: {
          where: departmentIds?.length ? { id: { in: departmentIds } } : undefined,
          orderBy: { type: 'asc' }
        }
      }
    });

    if (!hospital) {
      return NextResponse.json({ error: "Hospital not found" }, { status: 404 });
    }

    // Generate token number
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const count = await prisma.patientJourney.count({
      where: {
        hospitalId,
        createdAt: {
          gte: new Date(today.setHours(0, 0, 0, 0))
        }
      }
    });
    const tokenNumber = `${hospital.code}-${dateStr}-${String(count + 1).padStart(4, '0')}`;

    // Create journey with checkpoints
    const journey = await prisma.patientJourney.create({
      data: {
        patientId: user.patientProfile.id,
        hospitalId,
        visitType: visitType || 'opd',
        chiefComplaint,
        tokenNumber,
        status: 'active',
        estimatedTotalMinutes: hospital.departments.reduce(
          (sum, d) => sum + d.avgServiceTime, 0
        ),
        checkpoints: {
          create: hospital.departments.map((dept, index) => ({
            departmentId: dept.id,
            sequence: index + 1,
            status: index === 0 ? 'in_queue' : 'pending',
            queuePosition: index === 0 ? dept.currentQueue + 1 : null,
            estimatedWaitMinutes: index === 0 ? dept.currentQueue * dept.avgServiceTime : null
          }))
        }
      },
      include: {
        hospital: true,
        checkpoints: {
          include: {
            department: true
          },
          orderBy: { sequence: 'asc' }
        }
      }
    });

    // Update current queue for first department
    if (hospital.departments[0]) {
      await prisma.department.update({
        where: { id: hospital.departments[0].id },
        data: { currentQueue: { increment: 1 } }
      });
    }

    // Set current checkpoint
    if (journey.checkpoints[0]) {
      await prisma.patientJourney.update({
        where: { id: journey.id },
        data: { currentCheckpointId: journey.checkpoints[0].id }
      });
    }

    return NextResponse.json({
      success: true,
      journey,
      message: `Journey started! Your token is ${tokenNumber}`
    });

  } catch (error) {
    console.error('Journey create error:', error);
    return NextResponse.json({ error: "Failed to create journey" }, { status: 500 });
  }
}
