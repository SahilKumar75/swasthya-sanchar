// API Route: Get Patient Records
// GET /api/records/get?patientAddress=0x...
// Fetches medical records from blockchain (read-only, no wallet needed)

import { NextRequest, NextResponse } from 'next/server';
import { readFromBlockchain } from '@/lib/wallet-service';
import { healthRecordsABI } from '@/lib/contracts';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const patientAddress = searchParams.get('patientAddress');

        if (!patientAddress) {
            return NextResponse.json(
                { error: 'Patient address is required' },
                { status: 400 }
            );
        }

        // Get patient record IDs from blockchain
        const recordIds = await readFromBlockchain(
            CONTRACT_ADDRESS,
            healthRecordsABI,
            'getPatientRecords',
            [patientAddress]
        ) as bigint[];

        if (!recordIds || recordIds.length === 0) {
            return NextResponse.json({
                success: true,
                records: [],
                message: 'No records found for this patient',
            });
        }

        // Fetch each record's details
        const records = await Promise.all(
            recordIds.map(async (id) => {
                const record = await readFromBlockchain(
                    CONTRACT_ADDRESS,
                    healthRecordsABI,
                    'medicalRecords',
                    [id]
                ) as any;

                // Blockchain returns tuple array
                return {
                    id: record[0].toString(),
                    patient: record[1],
                    doctor: record[2],
                    recordHash: record[3],
                    timestamp: record[4].toString(),
                    isActive: record[5],
                };
            })
        );

        return NextResponse.json({
            success: true,
            records,
            count: records.length,
        });
    } catch (error: any) {
        console.error('Get records error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch records', details: error.message },
            { status: 500 }
        );
    }
}
