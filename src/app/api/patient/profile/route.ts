import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/wallet-service";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user with patient profile from Prisma
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { patientProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profile = user.patientProfile;

    if (!profile) {
      return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      walletAddress: user.walletAddress,
      isRegisteredOnChain: profile.isRegisteredOnChain || false,
      // Personal info
      name: user.name,
      dateOfBirth: profile.dateOfBirth?.toISOString().split('T')[0],
      gender: profile.gender,
      bloodGroup: profile.bloodGroup,
      // Contact info
      phone: profile.phone,
      email: user.email,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      pincode: profile.pincode,
      // Medical info
      allergies: profile.allergies,
      chronicConditions: profile.chronicConditions,
      currentMedications: profile.currentMedications,
      previousSurgeries: profile.previousSurgeries,
      // Physical measurements
      height: profile.height,
      weight: profile.weight,
      // Emergency contact
      emergencyName: profile.emergencyName,
      emergencyRelation: profile.emergencyRelation,
      emergencyPhone: profile.emergencyPhone,
    });
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient data" },
      { status: 500 }
    );
  }
}
