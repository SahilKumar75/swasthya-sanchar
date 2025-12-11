// API Route: Grant Doctor Access
// POST /api/patient/grant-access
// Allows patient to grant a doctor access to their records (no MetaMask!)

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma, writeToBlockchain } from '@/lib/wallet-service';
import { healthRecordsABI } from '@/lib/contracts';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || session.user.role !== 'patient') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { doctorAddress } = body;

        if (!doctorAddress) {
            return NextResponse.json(
                { error: 'Doctor address is required' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Grant access on blockchain (backend signs!)
        const txHash = await writeToBlockchain(
            user.id,
            CONTRACT_ADDRESS,
            healthRecordsABI,
            'grantAccess',
            [doctorAddress]
        );

        // Log transaction
        await prisma.transactionLog.create({
            data: {
                transactionHash: txHash,
                transactionType: 'grantAccess',
                fromAddress: user.walletAddress,
                toAddress: doctorAddress,
                status: 'success',
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Access granted successfully',
            transactionHash: txHash,
        });
    } catch (error: any) {
        console.error('Grant access error:', error);
        return NextResponse.json(
            { error: 'Failed to grant access', details: error.message },
            { status: 500 }
        );
    }
}
