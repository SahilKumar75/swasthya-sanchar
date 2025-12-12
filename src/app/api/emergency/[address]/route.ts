import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/wallet-service';

export async function GET(
    request: NextRequest,
    { params }: { params: { address: string } }
) {
    try {
        const { address } = params;

        if (!address) {
            return NextResponse.json(
                { error: 'Wallet address is required' },
                { status: 400 }
            );
        }

        // Find user by wallet address
        const user = await prisma.user.findUnique({
            where: {
                walletAddress: address.toLowerCase(),
            },
            include: {
                patientProfile: true,
            },
        });

        if (!user || !user.patientProfile) {
            return NextResponse.json(
                { error: 'Patient not found or not registered' },
                { status: 404 }
            );
        }

        const profile = user.patientProfile;

        // Format emergency data
        const emergencyData = {
            name: user.name || '',
            dateOfBirth: profile.dateOfBirth?.toISOString().split('T')[0] || '',
            gender: profile.gender || '',
            bloodGroup: profile.bloodGroup || '',
            phone: profile.phone || '',
            email: user.email || '',
            address: profile.address || '',
            city: profile.city || '',
            state: profile.state || '',
            pincode: profile.pincode || '',
            emergencyName: profile.emergencyName || '',
            emergencyRelation: profile.emergencyRelation || '',
            emergencyPhone: profile.emergencyPhone || '',
            allergies: profile.allergies || '',
            chronicConditions: profile.chronicConditions || '',
            currentMedications: profile.currentMedications || '',
            previousSurgeries: profile.previousSurgeries || '',
            height: profile.height || '',
            weight: profile.weight || '',
            waistCircumference: '',
            privacySettings: {
                gender: true,
                phone: true,
                email: false,
                address: true,
                height: false,
                weight: false,
                waistCircumference: false,
                previousSurgeries: false,
            },
            isRegisteredOnChain: profile.isRegisteredOnChain,
        };

        return NextResponse.json(emergencyData);
    } catch (error) {
        console.error('Error fetching emergency data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch emergency data' },
            { status: 500 }
        );
    }
}
