/**
 * Zero-Net QR Generation API
 * 
 * Generates QR codes with embedded emergency data that work 100% offline.
 * The QR contains compressed patient data - no internet needed to read.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/wallet-service";
import { encodeEmergencyProfile } from "@/lib/zero-net-qr";
import QRCode from "qrcode";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user and patient profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { patientProfile: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.patientProfile) {
      return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
    }

    const profile = user.patientProfile;

    // Generate Zero-Net encoded data
    const zeroNetData = encodeEmergencyProfile({
      fullName: profile.fullName,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      bloodGroup: profile.bloodGroup,
      allergies: profile.allergies,
      currentMedications: profile.currentMedications,
      chronicConditions: profile.chronicConditions,
      emergencyName: profile.emergencyName,
      emergencyRelation: profile.emergencyRelation,
      emergencyPhone: profile.emergencyPhone,
      walletAddress: user.walletAddress
    });

    // Generate QR code image
    // The QR contains the Zero-Net data directly (works offline)
    const qrDataUrl = await QRCode.toDataURL(zeroNetData, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    // Also generate a URL-based QR for fallback
    // This URL will handle both Zero-Net and legacy modes
    const baseUrl = process.env.NEXTAUTH_URL || 'https://swasthya-sanchar.vercel.app';
    const fallbackUrl = `${baseUrl}/emergency/${encodeURIComponent(zeroNetData)}`;

    return NextResponse.json({
      success: true,
      qrCode: qrDataUrl,
      zeroNetData: zeroNetData,
      fallbackUrl: fallbackUrl,
      dataSize: zeroNetData.length,
      encodedFields: [
        'name', 'dateOfBirth', 'gender', 'bloodGroup',
        'allergies', 'medications', 'conditions', 'emergencyContact'
      ],
      message: 'This QR code works 100% offline - no internet needed!'
    });

  } catch (error) {
    console.error('QR generation error:', error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}

// Also allow POST for custom data (admin/testing)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Generate Zero-Net encoded data from provided data
    const zeroNetData = encodeEmergencyProfile({
      fullName: body.fullName,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
      gender: body.gender,
      bloodGroup: body.bloodGroup,
      allergies: body.allergies,
      currentMedications: body.currentMedications,
      chronicConditions: body.chronicConditions,
      emergencyName: body.emergencyName,
      emergencyRelation: body.emergencyRelation,
      emergencyPhone: body.emergencyPhone,
      walletAddress: body.walletAddress
    });

    const qrDataUrl = await QRCode.toDataURL(zeroNetData, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'M'
    });

    return NextResponse.json({
      success: true,
      qrCode: qrDataUrl,
      zeroNetData: zeroNetData,
      dataSize: zeroNetData.length
    });

  } catch (error) {
    console.error('QR generation error:', error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}
