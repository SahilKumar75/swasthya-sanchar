/**
 * Seed API - Create demo hospital data (AIIMS-style)
 * POST /api/seed - Creates sample hospital with departments
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/wallet-service";

// Demo hospital data - AIIMS Delhi style
const DEMO_HOSPITALS = [
  {
    name: "AIIMS Delhi",
    code: "AIIMS-DEL",
    address: "Sri Aurobindo Marg, Ansari Nagar",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110029",
    phone: "011-26588500",
    email: "director@aiims.edu",
    type: "government",
    openTime: "08:00",
    closeTime: "20:00",
    hasEmergency: true,
    hasPharmacy: true,
    hasLab: true,
    departments: [
      { name: "OPD Registration", code: "REG", type: "registration", floor: 0, avgServiceTime: 10, icon: "ClipboardList", color: "blue" },
      { name: "General Medicine OPD", code: "MED-OPD", type: "consultation", floor: 1, wing: "A", avgServiceTime: 20, icon: "Stethoscope", color: "green" },
      { name: "Cardiology", code: "CARD", type: "consultation", floor: 2, wing: "B", avgServiceTime: 25, icon: "Heart", color: "red" },
      { name: "Orthopedics", code: "ORTHO", type: "consultation", floor: 2, wing: "C", avgServiceTime: 20, icon: "Bone", color: "orange" },
      { name: "X-Ray & Imaging", code: "XRAY", type: "diagnostic", floor: -1, avgServiceTime: 15, icon: "Scan", color: "purple" },
      { name: "Laboratory", code: "LAB", type: "diagnostic", floor: -1, avgServiceTime: 10, icon: "TestTube", color: "cyan" },
      { name: "Pharmacy", code: "PHARM", type: "pharmacy", floor: 0, avgServiceTime: 10, icon: "Pill", color: "emerald" },
      { name: "Billing Counter", code: "BILL", type: "billing", floor: 0, avgServiceTime: 5, icon: "Receipt", color: "amber" }
    ]
  },
  {
    name: "Safdarjung Hospital",
    code: "SJH-DEL",
    address: "Ring Road, New Delhi",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110029",
    phone: "011-26730000",
    type: "government",
    openTime: "08:00",
    closeTime: "18:00",
    hasEmergency: true,
    hasPharmacy: true,
    hasLab: true,
    departments: [
      { name: "Registration", code: "REG", type: "registration", floor: 0, avgServiceTime: 8, icon: "ClipboardList", color: "blue" },
      { name: "Medicine OPD", code: "MED", type: "consultation", floor: 1, avgServiceTime: 15, icon: "Stethoscope", color: "green" },
      { name: "Surgery OPD", code: "SURG", type: "consultation", floor: 1, avgServiceTime: 20, icon: "Scissors", color: "red" },
      { name: "Radiology", code: "RAD", type: "diagnostic", floor: -1, avgServiceTime: 12, icon: "Scan", color: "purple" },
      { name: "Pathology Lab", code: "PATH", type: "diagnostic", floor: -1, avgServiceTime: 8, icon: "TestTube", color: "cyan" },
      { name: "Pharmacy", code: "PHARM", type: "pharmacy", floor: 0, avgServiceTime: 8, icon: "Pill", color: "emerald" }
    ]
  },
  {
    name: "Max Super Specialty Hospital",
    code: "MAX-SAK",
    address: "Press Enclave Road, Saket",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110017",
    phone: "011-26515050",
    type: "private",
    openTime: "00:00",
    closeTime: "23:59",
    hasEmergency: true,
    hasPharmacy: true,
    hasLab: true,
    departments: [
      { name: "Reception & Registration", code: "REG", type: "registration", floor: 0, avgServiceTime: 5, icon: "ClipboardList", color: "blue" },
      { name: "Internal Medicine", code: "MED", type: "consultation", floor: 3, avgServiceTime: 15, icon: "Stethoscope", color: "green" },
      { name: "Cardiology", code: "CARD", type: "consultation", floor: 4, avgServiceTime: 20, icon: "Heart", color: "red" },
      { name: "Neurology", code: "NEURO", type: "consultation", floor: 5, avgServiceTime: 25, icon: "Brain", color: "violet" },
      { name: "Diagnostic Imaging", code: "IMG", type: "diagnostic", floor: 1, avgServiceTime: 20, icon: "Scan", color: "purple" },
      { name: "Clinical Laboratory", code: "LAB", type: "diagnostic", floor: 1, avgServiceTime: 10, icon: "TestTube", color: "cyan" },
      { name: "Pharmacy", code: "PHARM", type: "pharmacy", floor: 0, avgServiceTime: 7, icon: "Pill", color: "emerald" },
      { name: "Billing & Insurance", code: "BILL", type: "billing", floor: 0, avgServiceTime: 10, icon: "Receipt", color: "amber" }
    ]
  }
];

export async function POST(req: NextRequest) {
  try {
    const results = [];

    for (const hospitalData of DEMO_HOSPITALS) {
      // Check if hospital already exists
      const existing = await prisma.hospital.findUnique({
        where: { code: hospitalData.code }
      });

      if (existing) {
        results.push({ code: hospitalData.code, status: 'exists' });
        continue;
      }

      // Create hospital with departments
      const hospital = await prisma.hospital.create({
        data: {
          name: hospitalData.name,
          code: hospitalData.code,
          address: hospitalData.address,
          city: hospitalData.city,
          state: hospitalData.state,
          pincode: hospitalData.pincode,
          phone: hospitalData.phone,
          email: hospitalData.email,
          type: hospitalData.type,
          openTime: hospitalData.openTime,
          closeTime: hospitalData.closeTime,
          hasEmergency: hospitalData.hasEmergency,
          hasPharmacy: hospitalData.hasPharmacy,
          hasLab: hospitalData.hasLab,
          departments: {
            create: hospitalData.departments.map((dept: any, index: number) => ({
              name: dept.name,
              code: dept.code,
              type: dept.type,
              floor: dept.floor,
              wing: dept.wing || null,
              avgServiceTime: dept.avgServiceTime,
              maxCapacity: 100,
              currentQueue: Math.floor(Math.random() * 15), // Random queue for demo
              icon: dept.icon,
              color: dept.color,
              isOpen: true
            }))
          }
        },
        include: {
          departments: true
        }
      });

      results.push({ 
        code: hospital.code, 
        status: 'created',
        departmentCount: hospital.departments.length
      });
    }

    return NextResponse.json({
      success: true,
      message: "Demo hospitals seeded successfully",
      results
    });

  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ 
      error: "Failed to seed data",
      details: error.message 
    }, { status: 500 });
  }
}

// GET - Check seed status
export async function GET(req: NextRequest) {
  try {
    const hospitalCount = await prisma.hospital.count();
    const departmentCount = await prisma.department.count();

    const hospitals = await prisma.hospital.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        city: true,
        _count: {
          select: { departments: true }
        }
      }
    });

    return NextResponse.json({
      seeded: hospitalCount > 0,
      stats: {
        hospitals: hospitalCount,
        departments: departmentCount
      },
      hospitals
    });

  } catch (error) {
    console.error('Seed check error:', error);
    return NextResponse.json({ error: "Failed to check seed status" }, { status: 500 });
  }
}
