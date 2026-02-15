/**
 * Journey Details API - Get and Update a specific journey
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/wallet-service";

// GET - Get journey details
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Allow public access for shared journeys (check share token in query)
    const { searchParams } = new URL(req.url);
    const shareCode = searchParams.get('share');
    
    const journey = await prisma.patientJourney.findUnique({
      where: { id: params.id },
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
            code: true,
            address: true,
            city: true,
            phone: true,
            type: true
          }
        },
        patient: {
          select: {
            id: true,
            fullName: true,
            profilePicture: true,
            phone: true
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
                wing: true,
                avgServiceTime: true,
                currentQueue: true
              }
            },
            assignedStaff: {
              select: {
                name: true,
                role: true
              }
            }
          },
          orderBy: { sequence: 'asc' }
        },
        shares: {
          where: { isActive: true },
          select: {
            id: true,
            sharedWithPhone: true,
            shareType: true,
            createdAt: true
          }
        }
      }
    });

    if (!journey) {
      return NextResponse.json({ error: "Journey not found" }, { status: 404 });
    }

    // Check authorization
    if (shareCode) {
      // Verify share code
      const share = await prisma.journeyShare.findFirst({
        where: {
          journeyId: params.id,
          accessCode: shareCode,
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gte: new Date() } }
          ]
        }
      });
      
      if (!share) {
        return NextResponse.json({ error: "Invalid or expired share code" }, { status: 403 });
      }
    } else if (session?.user?.email) {
      // Check if user owns this journey or is shared with them
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { patientProfile: true }
      });
      
      if (user?.patientProfile?.id !== journey.patientId) {
        // Check if shared with this user
        const isShared = journey.shares.some(
          s => s.sharedWithPhone === user?.patientProfile?.phone
        );
        if (!isShared && user?.role !== 'doctor') {
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
      }
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calculate progress
    const completedCheckpoints = journey.checkpoints.filter(
      c => c.status === 'completed'
    ).length;
    const totalCheckpoints = journey.checkpoints.length;
    const progressPercent = Math.round((completedCheckpoints / totalCheckpoints) * 100);

    // Find current checkpoint
    const currentCheckpoint = journey.checkpoints.find(
      c => c.status === 'in_queue' || c.status === 'in_progress'
    ) || journey.checkpoints.find(c => c.status === 'pending');

    // Calculate estimated time remaining
    let estimatedRemainingMinutes = 0;
    let foundCurrent = false;
    for (const cp of journey.checkpoints) {
      if (cp.id === currentCheckpoint?.id) foundCurrent = true;
      if (foundCurrent && cp.status !== 'completed') {
        estimatedRemainingMinutes += (cp.estimatedWaitMinutes || 0) + 
          (cp.department.avgServiceTime || 15);
      }
    }

    return NextResponse.json({
      journey: {
        ...journey,
        progressPercent,
        currentCheckpoint,
        estimatedRemainingMinutes,
        completedCheckpoints,
        totalCheckpoints
      }
    });

  } catch (error) {
    console.error('Journey fetch error:', error);
    return NextResponse.json({ error: "Failed to fetch journey" }, { status: 500 });
  }
}

// PATCH - Update journey status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (!['active', 'completed', 'cancelled', 'paused'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const journey = await prisma.patientJourney.update({
      where: { id: params.id },
      data: {
        status,
        ...(status === 'completed' ? { completedAt: new Date() } : {})
      },
      include: {
        hospital: true,
        checkpoints: {
          include: { department: true },
          orderBy: { sequence: 'asc' }
        }
      }
    });

    return NextResponse.json({ success: true, journey });

  } catch (error) {
    console.error('Journey update error:', error);
    return NextResponse.json({ error: "Failed to update journey" }, { status: 500 });
  }
}
