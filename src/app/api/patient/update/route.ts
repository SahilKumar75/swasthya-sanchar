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

        // Update patient profile
        await prisma.patientProfile.update({
            where: { userId: session.user.id },
            data: {
                bloodGroup: body.bloodGroup,
                allergies: body.allergies,
                chronicConditions: body.chronicConditions,
                currentMedications: body.currentMedications,
                emergencyName: body.emergencyName,
                emergencyPhone: body.emergencyPhone,
            },
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
