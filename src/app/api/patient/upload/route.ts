
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
        if (!session || !session.user || session.user.role !== 'patient') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const category = formData.get('category') as string;
        const description = formData.get('description') as string;

        if (!file) {
            return NextResponse.json(
                { error: 'File is required' },
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

        // Add metadata for Pinata
        const metadata = JSON.stringify({
            name: file.name,
            keyvalues: {
                uploaderId: user.id,
                role: 'patient',
                category: category || 'General',
                description: description || ''
            }
        });
        pinataFormData.append('pinataMetadata', metadata);

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
            const errorText = await pinataResponse.text();
            console.error('Pinata API Error:', {
                status: pinataResponse.status,
                statusText: pinataResponse.statusText,
                body: errorText
            });
            throw new Error(`Failed to upload to IPFS: ${pinataResponse.status} ${errorText}`);
        }

        const pinataData = await pinataResponse.json();
        const ipfsHash = pinataData.IpfsHash;

        // Create record on blockchain
        // Patient calls createRecord(patientAddress, hash)
        // Since patient is msg.sender, they can call it for themselves.
        const txHash = await writeToBlockchain(
            user.id,
            CONTRACT_ADDRESS,
            HEALTH_RECORDS_ABI,
            'createRecord',
            [user.walletAddress, ipfsHash]
        );

        // Log transaction
        await prisma.transactionLog.create({
            data: {
                transactionHash: txHash,
                transactionType: 'createRecord',
                fromAddress: user.walletAddress,
                toAddress: user.walletAddress, // Self-upload
                status: 'success',
                metadata: {
                    ipfsHash,
                    fileName: file.name,
                    category,
                    description
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Record uploaded successfully',
            transactionHash: txHash,
            ipfsHash,
            ipfsUrl: `${PINATA_GATEWAY}/ipfs/${ipfsHash}`,
        });
    } catch (error: any) {
        console.error('Patient upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload record', details: error.message },
            { status: 500 }
        );
    }
}
