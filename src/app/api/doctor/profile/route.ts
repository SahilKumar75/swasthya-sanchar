import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { doctors } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET - Fetch doctor profile
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "doctor") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get doctor profile from database
    const doctor = await db.query.doctors.findFirst({
      where: eq(doctors.userId, session.user.id),
    });

    return NextResponse.json({ doctor: doctor || null });
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctor profile" },
      { status: 500 }
    );
  }
}

// POST - Save or update doctor profile
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "doctor") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      licenseNumber,
      specialization,
      qualification,
      experience,
      hospital,
      city,
      state,
      email,
      phone,
    } = body;

    // Validate required fields
    if (!name || !licenseNumber) {
      return NextResponse.json(
        { error: "Name and license number are required" },
        { status: 400 }
      );
    }

    // Check if doctor profile already exists
    const existingDoctor = await db.query.doctors.findFirst({
      where: eq(doctors.userId, session.user.id),
    });

    if (existingDoctor) {
      // Update existing profile
      await db
        .update(doctors)
        .set({
          name,
          licenseNumber,
          specialization: specialization || null,
          qualification: qualification || null,
          experience: experience || null,
          hospital: hospital || null,
          city: city || null,
          state: state || null,
          email: email || null,
          phone: phone || null,
        })
        .where(eq(doctors.userId, session.user.id));

      return NextResponse.json({
        message: "Profile updated successfully",
        doctor: {
          ...existingDoctor,
          name,
          licenseNumber,
          specialization,
          qualification,
          experience,
          hospital,
          city,
          state,
          email,
          phone,
        },
      });
    } else {
      // Create new profile
      const newDoctor = await db.insert(doctors).values({
        userId: session.user.id,
        name,
        licenseNumber,
        specialization: specialization || null,
        qualification: qualification || null,
        experience: experience || null,
        hospital: hospital || null,
        city: city || null,
        state: state || null,
        email: email || null,
        phone: phone || null,
      }).returning();

      return NextResponse.json({
        message: "Profile created successfully",
        doctor: newDoctor[0],
      });
    }
  } catch (error) {
    console.error("Error saving doctor profile:", error);
    return NextResponse.json(
      { error: "Failed to save doctor profile" },
      { status: 500 }
    );
  }
}
