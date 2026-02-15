/**
 * Journey Share API - Share journey with family members
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/wallet-service";

// Generate random 6-digit code
function generateAccessCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// GET - Get shares for a journey
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shares = await prisma.journeyShare.findMany({
      where: {
        journeyId: params.id,
        isActive: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ shares });

  } catch (error) {
    console.error('Share fetch error:', error);
    return NextResponse.json({ error: "Failed to fetch shares" }, { status: 500 });
  }
}

// POST - Create a new share
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user owns this journey
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { patientProfile: true }
    });

    const journey = await prisma.patientJourney.findUnique({
      where: { id: params.id }
    });

    if (!journey || journey.patientId !== user?.patientProfile?.id) {
      return NextResponse.json({ error: "Journey not found or unauthorized" }, { status: 404 });
    }

    const body = await req.json();
    const { 
      phone, 
      email, 
      shareType = 'view',
      notifyViaWhatsApp = true,
      notifyViaSMS = false,
      expiresInHours
    } = body;

    if (!phone && !email) {
      return NextResponse.json({ error: "Phone or email is required" }, { status: 400 });
    }

    // Generate access code and share link
    const accessCode = generateAccessCode();
    const expiresAt = expiresInHours 
      ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
      : null;

    const share = await prisma.journeyShare.create({
      data: {
        journeyId: params.id,
        sharedWithPhone: phone,
        sharedWithEmail: email,
        shareType,
        accessCode,
        expiresAt,
        notifyOnUpdate: true,
        notifyViaWhatsApp,
        notifyViaSMS
      }
    });

    // Generate share URL
    const baseUrl = process.env.NEXTAUTH_URL || 'https://swasthya-sanchar.vercel.app';
    const shareUrl = `${baseUrl}/journey/track/${params.id}?share=${accessCode}`;

    // TODO: Send WhatsApp/SMS notification
    // For now, return the share link

    return NextResponse.json({
      success: true,
      share,
      shareUrl,
      accessCode,
      message: `Share link created! Send this to your family member: ${shareUrl}`
    });

  } catch (error) {
    console.error('Share create error:', error);
    return NextResponse.json({ error: "Failed to create share" }, { status: 500 });
  }
}

// DELETE - Revoke a share
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const shareId = searchParams.get('shareId');

    if (!shareId) {
      return NextResponse.json({ error: "shareId is required" }, { status: 400 });
    }

    await prisma.journeyShare.update({
      where: { id: shareId },
      data: { isActive: false }
    });

    return NextResponse.json({ success: true, message: "Share revoked" });

  } catch (error) {
    console.error('Share delete error:', error);
    return NextResponse.json({ error: "Failed to revoke share" }, { status: 500 });
  }
}
