/**
 * Hospitals API - List hospitals and departments
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/wallet-service";

// GET - List hospitals with optional city filter
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const withDepartments = searchParams.get('departments') === 'true';

    const hospitals = await prisma.hospital.findMany({
      where: city ? { city: { contains: city, mode: 'insensitive' } } : undefined,
      include: withDepartments ? {
        departments: {
          where: { isOpen: true },
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
            currentQueue: true,
            maxCapacity: true
          },
          orderBy: { type: 'asc' }
        }
      } : undefined,
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ hospitals });

  } catch (error) {
    console.error('Hospitals fetch error:', error);
    return NextResponse.json({ error: "Failed to fetch hospitals" }, { status: 500 });
  }
}

// POST - Create a new hospital (admin only - for seeding)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const hospital = await prisma.hospital.create({
      data: {
        name: body.name,
        code: body.code,
        address: body.address,
        city: body.city,
        state: body.state,
        pincode: body.pincode,
        phone: body.phone,
        email: body.email,
        type: body.type || 'government',
        openTime: body.openTime || '08:00',
        closeTime: body.closeTime || '20:00',
        hasEmergency: body.hasEmergency ?? true,
        hasPharmacy: body.hasPharmacy ?? true,
        hasLab: body.hasLab ?? true,
        departments: body.departments ? {
          create: body.departments.map((dept: any, index: number) => ({
            name: dept.name,
            code: dept.code,
            type: dept.type,
            floor: dept.floor || 0,
            wing: dept.wing,
            avgServiceTime: dept.avgServiceTime || 15,
            maxCapacity: dept.maxCapacity || 50,
            icon: dept.icon,
            color: dept.color
          }))
        } : undefined
      },
      include: {
        departments: true
      }
    });

    return NextResponse.json({ success: true, hospital });

  } catch (error: any) {
    console.error('Hospital create error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Hospital code already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create hospital" }, { status: 500 });
  }
}
