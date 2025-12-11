// API Route: Upload Medical Record
// POST /api/doctor/upload-record
// Doctor uploads medical record to IPFS and blockchain (no MetaMask!)

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma, writeToBlockchain } from '@/lib/wallet-service';
import { HEALTH_RECORDS_ABI } from '@/lib/contracts';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || '';
const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || '';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || session.user.role !== 'doctor') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const patientAddress = formData.get('patientAddress') as string;

        if (!file || !patientAddress) {
            return NextResponse.json(
                { error: 'File and patient address are required' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Upload file to IPFS (Pinata)
        const pinataFormData = new FormData();
        pinataFormData.append('file', file);

        const pinataResponse = await fetch(
            'https://api.pinata.cloud/pinning/pinFileToIPFS',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${PINATA_JWT}`,
                },
                body: pinataFormData,
            }
        );

        if (!pinataResponse.ok) {
            throw new Error('Failed to upload to IPFS');
        }

        const pinataData = await pinataResponse.json();
        const ipfsHash = pinataData.IpfsHash;

        // Create record on blockchain (backend signs!)
        const txHash = await writeToBlockchain(
            user.id,
            CONTRACT_ADDRESS,
            HEALTH_RECORDS_ABI,
            'createRecord',
            [patientAddress, ipfsHash]
        );

        // Log transaction
        await prisma.transactionLog.create({
            data: {
                transactionHash: txHash,
                transactionType: 'createRecord',
                fromAddress: user.walletAddress,
                toAddress: patientAddress,
                status: 'success',
                metadata: {
                    ipfsHash,
                    fileName: file.name,
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Medical record uploaded successfully',
            transactionHash: txHash,
            ipfsHash,
            ipfsUrl: `${PINATA_GATEWAY}/ipfs/${ipfsHash}`,
        });
    } catch (error: any) {
        console.error('Upload record error:', error);
        return NextResponse.json(
            { error: 'Failed to upload record', details: error.message },
            { status: 500 }
        );
    }
}
