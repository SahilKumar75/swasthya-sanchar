import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/wallet-service';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user with wallet address
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
            select: {
                walletAddress: true,
            },
        });

        if (!user || !user.walletAddress) {
            return NextResponse.json(
                { error: 'Wallet address not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            walletAddress: user.walletAddress,
        });
    } catch (error) {
        console.error('Error fetching wallet address:', error);
        return NextResponse.json(
            { error: 'Failed to fetch wallet address' },
            { status: 500 }
        );
    }
}
