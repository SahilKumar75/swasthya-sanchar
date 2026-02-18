
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma, readFromBlockchain } from '@/lib/wallet-service';
import { HEALTH_RECORDS_ABI } from '@/lib/contracts';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || session.user.role !== 'patient') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get authorized doctor addresses from blockchain
        const authorizedAddresses = await readFromBlockchain(
            CONTRACT_ADDRESS,
            HEALTH_RECORDS_ABI,
            'getAuthorizedDoctors',
            [user.walletAddress]
        ) as string[];

        if (!authorizedAddresses || authorizedAddresses.length === 0) {
            return NextResponse.json({
                success: true,
                permissions: []
            });
        }

        // Normalize addresses (lowercase)
        const normalizedAddresses = authorizedAddresses.map(addr => addr.toLowerCase());

        // Find doctor details from DB
        const doctors = await prisma.user.findMany({
            where: {
                walletAddress: { in: authorizedAddresses, mode: 'insensitive' },
                role: 'doctor'
            },
            include: {
                doctorProfile: true
            }
        });

        const permissions = doctors.map(doc => ({
            id: doc.id,
            doctorId: doc.id,
            doctorName: doc.name || 'Unknown Doctor',
            walletAddress: doc.walletAddress,
            specialization: doc.doctorProfile?.specialization,
            hospital: doc.doctorProfile?.hospital,
            grantedAt: new Date().toISOString(), // Mock, as contract doesn't return timestamp easily here
            isActive: true // Since they are in the list, it's active
        }));

        return NextResponse.json({
            success: true,
            permissions
        });

    } catch (error: any) {
        console.error('Get permissions error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch permissions', details: error.message },
            { status: 500 }
        );
    }
}
