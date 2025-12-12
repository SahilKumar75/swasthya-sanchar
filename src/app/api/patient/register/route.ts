// API Route: Patient Registration on Blockchain
// POST /api/patient/register
// Registers patient on blockchain using backend wallet (no MetaMask needed!)

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma, writeToBlockchain } from '@/lib/wallet-service';
import { HEALTH_RECORDS_ABI } from '@/lib/contracts';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (session.user.role !== 'patient') {
            return NextResponse.json(
                { error: 'Only patients can register' },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { dateOfBirth, emergencyData } = body;

        if (!dateOfBirth) {
            return NextResponse.json(
                { error: 'Date of birth is required' },
                { status: 400 }
            );
        }

        // Get user from database
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

        // Check if already registered on blockchain
        const isAlreadyRegistered = user.patientProfile?.isRegisteredOnChain;

        if (isAlreadyRegistered) {
            console.log('📝 Patient already registered, updating information...');

            // Update patient profile in database only (blockchain already has record)
            await prisma.patientProfile.update({
                where: { userId: user.id },
                data: {
                    dateOfBirth: new Date(dateOfBirth),
                    bloodGroup: emergencyData?.bloodGroup,
                    allergies: emergencyData?.allergies,
                    chronicConditions: emergencyData?.chronicConditions,
                    currentMedications: emergencyData?.currentMedications,
                    emergencyName: emergencyData?.emergencyName,
                    emergencyPhone: emergencyData?.emergencyPhone,
                },
            });

            return NextResponse.json({
                success: true,
                message: 'Patient information updated successfully',
                walletAddress: user.walletAddress,
                updated: true,
            });
        }

        // Convert date of birth to timestamp
        const dobTimestamp = Math.floor(new Date(dateOfBirth).getTime() / 1000);

        // Prepare emergency data JSON
        const emergencyProfileHash = JSON.stringify(emergencyData || {});

        let txHash = '';
        let blockchainRegistered = false;

        // Try to register on blockchain (backend signs transaction!)
        try {
            txHash = await writeToBlockchain(
                user.id,
                CONTRACT_ADDRESS,
                HEALTH_RECORDS_ABI,
                'registerPatient',
                [user.name || 'Patient', dobTimestamp, emergencyProfileHash]
            );
            blockchainRegistered = true;
            console.log('✅ Successfully registered on blockchain:', txHash);
        } catch (blockchainError: any) {
            // Check if error is due to already being registered
            if (blockchainError.message?.includes('already registered')) {
                console.log('📝 Patient already on blockchain, updating database only...');
                blockchainRegistered = false; // Already registered, just update DB
            } else {
                // Some other blockchain error, rethrow
                throw blockchainError;
            }
        }

        // Update patient profile in database
        await prisma.patientProfile.update({
            where: { userId: user.id },
            data: {
                dateOfBirth: new Date(dateOfBirth),
                bloodGroup: emergencyData?.bloodGroup,
                allergies: emergencyData?.allergies,
                chronicConditions: emergencyData?.chronicConditions,
                currentMedications: emergencyData?.currentMedications,
                emergencyName: emergencyData?.emergencyName,
                emergencyPhone: emergencyData?.emergencyPhone,
                isRegisteredOnChain: true, // Mark as registered regardless
                registeredAt: new Date(),
            },
        });

        // Log transaction only if new blockchain registration
        if (blockchainRegistered && txHash) {
            await prisma.transactionLog.create({
                data: {
                    transactionHash: txHash,
                    transactionType: 'register',
                    fromAddress: user.walletAddress,
                    status: 'success',
                    metadata: {
                        dateOfBirth,
                        emergencyData,
                    },
                },
            });
        }

        return NextResponse.json({
            success: true,
            message: blockchainRegistered
                ? 'Patient registered on blockchain successfully'
                : 'Patient information updated successfully',
            transactionHash: txHash || undefined,
            walletAddress: user.walletAddress,
            updated: !blockchainRegistered,
        });
    } catch (error: any) {
        console.error('❌ Patient registration error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        return NextResponse.json(
            {
                error: 'Failed to register patient on blockchain',
                details: error.message,
                errorType: error.name
            },
            { status: 500 }
        );
    }
}
