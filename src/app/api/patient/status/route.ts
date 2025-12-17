import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/wallet-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { patientProfile: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            isRegisteredOnChain: user.patientProfile?.isRegisteredOnChain || false,
            walletAddress: user.walletAddress,
            registeredAt: user.patientProfile?.registeredAt,
            fullName: user.patientProfile?.fullName,
            profilePicture: user.patientProfile?.profilePicture,
            dateOfBirth: user.patientProfile?.dateOfBirth,
            bloodGroup: user.patientProfile?.bloodGroup,
            allergies: user.patientProfile?.allergies,
            chronicConditions: user.patientProfile?.chronicConditions,
            currentMedications: user.patientProfile?.currentMedications,
            emergencyName: user.patientProfile?.emergencyName,
            emergencyPhone: user.patientProfile?.emergencyPhone,
            height: user.patientProfile?.height,
            weight: user.patientProfile?.weight,
        });
    } catch (error: any) {
        console.error('Error checking patient status:', error);
        return NextResponse.json(
            { error: 'Failed to check status' },
            { status: 500 }
        );
    }
}
