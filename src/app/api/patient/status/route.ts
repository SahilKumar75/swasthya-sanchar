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
            gender: user.patientProfile?.gender,
            bloodGroup: user.patientProfile?.bloodGroup,
            phone: user.patientProfile?.phone,
            streetAddress: user.patientProfile?.streetAddress,
            address: user.patientProfile?.address,
            city: user.patientProfile?.city,
            state: user.patientProfile?.state,
            pincode: user.patientProfile?.pincode,
            allergies: user.patientProfile?.allergies,
            chronicConditions: user.patientProfile?.chronicConditions,
            currentMedications: user.patientProfile?.currentMedications,
            previousSurgeries: user.patientProfile?.previousSurgeries,
            emergencyName: user.patientProfile?.emergencyName,
            emergencyRelation: user.patientProfile?.emergencyRelation,
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
