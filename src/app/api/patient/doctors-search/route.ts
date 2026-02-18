
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/wallet-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || session.user.role !== 'patient') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query') || '';

        // Search doctors by name, email, specialization, or hospital
        const doctors = await prisma.user.findMany({
            where: {
                role: 'doctor',
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                    {
                        doctorProfile: {
                            OR: [
                                { specialization: { contains: query, mode: 'insensitive' } },
                                { hospital: { contains: query, mode: 'insensitive' } },
                            ]
                        }
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                walletAddress: true,
                doctorProfile: {
                    select: {
                        specialization: true,
                        hospital: true,
                        medicalLicense: true,
                    }
                }
            },
            take: 20, // Limit results
        });

        // Format for frontend
        const formattedDoctors = doctors.map(doc => ({
            id: doc.id,
            name: doc.name || 'Unknown Doctor',
            walletAddress: doc.walletAddress,
            specialization: doc.doctorProfile?.specialization || 'General',
            hospital: doc.doctorProfile?.hospital || 'Independent',
            license: doc.doctorProfile?.medicalLicense,
        }));

        return NextResponse.json({
            success: true,
            doctors: formattedDoctors
        });

    } catch (error: any) {
        console.error('Search doctors error:', error);
        return NextResponse.json(
            { error: 'Failed to search doctors', details: error.message },
            { status: 500 }
        );
    }
}
