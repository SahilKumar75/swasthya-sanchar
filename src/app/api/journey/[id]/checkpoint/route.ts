/**
 * Journey Checkpoint API - Update checkpoint status
 * Used by hospital staff to mark patient progress
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/wallet-service";

// POST - Update a checkpoint status
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { checkpointId, status, notes, actualServiceMinutes } = body;

    if (!checkpointId || !status) {
      return NextResponse.json(
        { error: "checkpointId and status are required" }, 
        { status: 400 }
      );
    }

    if (!['pending', 'in_queue', 'in_progress', 'completed', 'skipped'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get the checkpoint and verify it belongs to this journey
    const checkpoint = await prisma.journeyCheckpoint.findFirst({
      where: {
        id: checkpointId,
        journeyId: params.id
      },
      include: {
        journey: true,
        department: true
      }
    });

    if (!checkpoint) {
      return NextResponse.json({ error: "Checkpoint not found" }, { status: 404 });
    }

    const now = new Date();
    const updateData: any = {
      status,
      notes: notes || checkpoint.notes,
      updatedAt: now
    };

    // Update timing based on status transition
    if (status === 'in_queue' && !checkpoint.arrivedAt) {
      updateData.arrivedAt = now;
    }
    
    if (status === 'in_progress' && !checkpoint.startedAt) {
      updateData.startedAt = now;
      if (checkpoint.arrivedAt) {
        updateData.actualWaitMinutes = Math.round(
          (now.getTime() - checkpoint.arrivedAt.getTime()) / 60000
        );
      }
    }
    
    if (status === 'completed') {
      updateData.completedAt = now;
      if (checkpoint.startedAt) {
        updateData.actualServiceMinutes = actualServiceMinutes || Math.round(
          (now.getTime() - checkpoint.startedAt.getTime()) / 60000
        );
      }
    }

    // Update the checkpoint
    const updatedCheckpoint = await prisma.journeyCheckpoint.update({
      where: { id: checkpointId },
      data: updateData,
      include: { department: true }
    });

    // If completed, move to next checkpoint
    if (status === 'completed') {
      // Find next checkpoint
      const nextCheckpoint = await prisma.journeyCheckpoint.findFirst({
        where: {
          journeyId: params.id,
          sequence: checkpoint.sequence + 1
        },
        include: { department: true }
      });

      if (nextCheckpoint) {
        // Update next checkpoint to in_queue
        await prisma.journeyCheckpoint.update({
          where: { id: nextCheckpoint.id },
          data: {
            status: 'in_queue',
            arrivedAt: now,
            queuePosition: nextCheckpoint.department.currentQueue + 1,
            estimatedWaitMinutes: nextCheckpoint.department.currentQueue * 
              nextCheckpoint.department.avgServiceTime
          }
        });

        // Update department queue
        await prisma.department.update({
          where: { id: nextCheckpoint.departmentId },
          data: { currentQueue: { increment: 1 } }
        });

        // Update journey's current checkpoint
        await prisma.patientJourney.update({
          where: { id: params.id },
          data: { currentCheckpointId: nextCheckpoint.id }
        });
      } else {
        // No more checkpoints - journey completed
        const allCheckpoints = await prisma.journeyCheckpoint.findMany({
          where: { journeyId: params.id }
        });
        
        const allCompleted = allCheckpoints.every(
          c => c.status === 'completed' || c.status === 'skipped'
        );

        if (allCompleted) {
          const journey = await prisma.patientJourney.findUnique({
            where: { id: params.id }
          });

          await prisma.patientJourney.update({
            where: { id: params.id },
            data: {
              status: 'completed',
              completedAt: now,
              progressPercent: 100,
              actualTotalMinutes: journey?.startedAt 
                ? Math.round((now.getTime() - journey.startedAt.getTime()) / 60000)
                : null
            }
          });
        }
      }

      // Decrease queue count for completed department
      await prisma.department.update({
        where: { id: checkpoint.departmentId },
        data: { currentQueue: { decrement: 1 } }
      });
    }

    // Update journey progress
    const allCheckpoints = await prisma.journeyCheckpoint.findMany({
      where: { journeyId: params.id }
    });
    
    const completedCount = allCheckpoints.filter(
      c => c.status === 'completed' || c.status === 'skipped'
    ).length;
    
    const progressPercent = Math.round((completedCount / allCheckpoints.length) * 100);
    
    await prisma.patientJourney.update({
      where: { id: params.id },
      data: { progressPercent }
    });

    // Fetch updated journey
    const updatedJourney = await prisma.patientJourney.findUnique({
      where: { id: params.id },
      include: {
        hospital: true,
        checkpoints: {
          include: { department: true },
          orderBy: { sequence: 'asc' }
        }
      }
    });

    return NextResponse.json({
      success: true,
      checkpoint: updatedCheckpoint,
      journey: updatedJourney
    });

  } catch (error) {
    console.error('Checkpoint update error:', error);
    return NextResponse.json({ error: "Failed to update checkpoint" }, { status: 500 });
  }
}
