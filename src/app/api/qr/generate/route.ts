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

    // Generate URL with embedded Zero-Net data
    // This URL works because the emergency page decodes SS1: data from URL params
    const baseUrl = process.env.NEXTAUTH_URL || 'https://swasthya-sanchar.vercel.app';
    const zeroNetUrl = `${baseUrl}/emergency/${encodeURIComponent(zeroNetData)}`;
    
    // Generate QR code with the URL (not raw data)
    // When scanned, phone opens browser → page decodes SS1: data from URL
    // With PWA caching, this works even offline!
    const qrDataUrl = await QRCode.toDataURL(zeroNetUrl, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'L', // Lower error correction to fit longer URL
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    return NextResponse.json({
      success: true,
      qrCode: qrDataUrl,
      zeroNetData: zeroNetData,
      zeroNetUrl: zeroNetUrl,
      dataSize: zeroNetData.length,
      urlSize: zeroNetUrl.length,
      encodedFields: [
        'name', 'dateOfBirth', 'gender', 'bloodGroup',
        'allergies', 'medications', 'conditions', 'emergencyContact'
      ],
      message: 'QR opens browser with embedded data - works offline with PWA!'
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
