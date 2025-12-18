import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/wallet-service';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();

        // Build update object with only provided fields
        const updateData: any = {};

        if (body.bloodGroup !== undefined) updateData.bloodGroup = body.bloodGroup;
        if (body.allergies !== undefined) updateData.allergies = body.allergies;
        if (body.chronicConditions !== undefined) updateData.chronicConditions = body.chronicConditions;
        if (body.currentMedications !== undefined) updateData.currentMedications = body.currentMedications;
        if (body.emergencyName !== undefined) updateData.emergencyName = body.emergencyName;
        if (body.emergencyPhone !== undefined) updateData.emergencyPhone = body.emergencyPhone;
        if (body.gender !== undefined) updateData.gender = body.gender;
        if (body.phone !== undefined) updateData.phone = body.phone;
        if (body.address !== undefined) updateData.address = body.address;
        if (body.city !== undefined) updateData.city = body.city;
        if (body.state !== undefined) updateData.state = body.state;
        if (body.pincode !== undefined) updateData.pincode = body.pincode;
        if (body.emergencyRelation !== undefined) updateData.emergencyRelation = body.emergencyRelation;

        // Update patient profile with only provided fields
        await prisma.patientProfile.update({
            where: { userId: session.user.id },
            data: updateData,
        });

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error: any) {
        console.error('Error updating patient profile:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}
