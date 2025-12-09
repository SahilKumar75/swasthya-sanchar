import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { patients } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the cached patient data
    const result = await db
      .select()
      .from(patients)
      .where(eq(patients.userId, session.user.id))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "Patient record not found" }, { status: 404 });
    }

    const patient = result[0];

    return NextResponse.json({
      success: true,
      data: {
        name: patient.name,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        phone: patient.phone,
        email: patient.email,
        address: patient.address,
        city: patient.city,
        state: patient.state,
        pincode: patient.pincode,
        emergencyName: patient.emergencyName,
        emergencyRelation: patient.emergencyRelation,
        emergencyPhone: patient.emergencyPhone,
        allergies: patient.allergies,
        chronicConditions: patient.chronicConditions,
        currentMedications: patient.currentMedications,
        previousSurgeries: patient.previousSurgeries,
        height: patient.height,
        weight: patient.weight,
        waistCircumference: patient.waistCircumference,
        lastCheckedDate: patient.lastCheckedDate,
        registeredOnBlockchain: patient.registeredOnBlockchain,
        lastSyncedAt: patient.lastSyncedAt,
      },
      cached: true,
    });
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient data" },
      { status: 500 }
    );
  }
}
