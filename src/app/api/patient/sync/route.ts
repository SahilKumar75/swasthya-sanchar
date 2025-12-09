import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { patients } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { patientData, walletAddress } = body;

    if (!patientData) {
      return NextResponse.json({ error: "Patient data is required" }, { status: 400 });
    }

    // Find the patient record
    const existingPatients = await db
      .select()
      .from(patients)
      .where(eq(patients.userId, session.user.id))
      .limit(1);

    if (existingPatients.length === 0) {
      return NextResponse.json({ error: "Patient record not found" }, { status: 404 });
    }

    const patient = existingPatients[0];

    // Update the cached data from blockchain
    await db
      .update(patients)
      .set({
        // Personal Information
        gender: patientData.gender || null,
        bloodGroup: patientData.bloodGroup || null,
        
        // Contact Information
        phone: patientData.phone || null,
        email: patientData.email || null,
        address: patientData.address || null,
        city: patientData.city || null,
        state: patientData.state || null,
        pincode: patientData.pincode || null,
        
        // Emergency Contact
        emergencyName: patientData.emergencyName || null,
        emergencyRelation: patientData.emergencyRelation || null,
        emergencyPhone: patientData.emergencyPhone || null,
        
        // Medical Information
        allergies: patientData.allergies || null,
        chronicConditions: patientData.chronicConditions || null,
        currentMedications: patientData.currentMedications || null,
        previousSurgeries: patientData.previousSurgeries || null,
        
        // Physical Measurements
        height: patientData.height || null,
        weight: patientData.weight || null,
        waistCircumference: patientData.waistCircumference || null,
        lastCheckedDate: patientData.lastCheckedDate || null,
        
        // Update tracking fields
        registeredOnBlockchain: true,
        lastSyncedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(patients.id, patient.id));

    return NextResponse.json({ 
      success: true,
      message: "Patient data synced to database cache"
    });
  } catch (error) {
    console.error("Error syncing patient data:", error);
    return NextResponse.json(
      { error: "Failed to sync patient data" },
      { status: 500 }
    );
  }
}
