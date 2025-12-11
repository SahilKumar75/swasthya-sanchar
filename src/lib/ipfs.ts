/**
 * IPFS Integration using Pinata
 * Handles medical record upload and retrieval
 */

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud';

interface UploadResponse {
    IpfsHash: string;
    PinSize: number;
    Timestamp: string;
}

/**
 * Upload a file to IPFS via Pinata
 * @param file - File to upload
 * @returns IPFS hash (CID)
 */
export async function uploadToIPFS(file: File): Promise<string> {
    if (!PINATA_JWT) {
        throw new Error('Pinata JWT not configured. Add NEXT_PUBLIC_PINATA_JWT to .env.local');
    }

    // Validate file size (max 10MB for demo)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
        throw new Error(`File size exceeds 10MB limit. Got ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    // Validate file type
    const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(`File type ${file.type} not allowed. Use PDF, JPG, or PNG.`);
    }

    try {
        const formData = new FormData();
        formData.append('file', file);

        // Add metadata
        const metadata = JSON.stringify({
            name: file.name,
            keyvalues: {
                uploadedAt: new Date().toISOString(),
                fileType: file.type,
                fileSize: file.size.toString(),
            },
        });
        formData.append('pinataMetadata', metadata);

        // Upload to Pinata
        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${PINATA_JWT}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Pinata upload failed: ${error.error || response.statusText}`);
        }

        const data: UploadResponse = await response.json();
        return data.IpfsHash;
    } catch (error) {
        console.error('IPFS upload error:', error);
        throw error;
    }
}

/**
 * Upload JSON data to IPFS
 * @param data - JSON object to upload
 * @returns IPFS hash (CID)
 */
export async function uploadJSON(data: object): Promise<string> {
    if (!PINATA_JWT) {
        throw new Error('Pinata JWT not configured');
    }

    try {
        const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${PINATA_JWT}`,
            },
            body: JSON.stringify({
                pinataContent: data,
                pinataMetadata: {
                    name: 'medical-record-metadata',
                    keyvalues: {
                        uploadedAt: new Date().toISOString(),
                    },
                },
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Pinata JSON upload failed: ${error.error || response.statusText}`);
        }

        const result: UploadResponse = await response.json();
        return result.IpfsHash;
    } catch (error) {
        console.error('IPFS JSON upload error:', error);
        throw error;
    }
}

/**
 * Get the public URL for an IPFS hash
 * @param hash - IPFS hash (CID)
 * @returns Public gateway URL
 */
export function getIPFSUrl(hash: string): string {
    if (!hash) {
        throw new Error('IPFS hash is required');
    }
    return `${PINATA_GATEWAY}/ipfs/${hash}`;
}

/**
 * Fetch file from IPFS
 * @param hash - IPFS hash (CID)
 * @returns File blob
 */
export async function fetchFromIPFS(hash: string): Promise<Blob> {
    const url = getIPFSUrl(hash);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
        }
        return await response.blob();
    } catch (error) {
        console.error('IPFS fetch error:', error);
        throw error;
    }
}

/**
 * Fetch JSON data from IPFS
 * @param hash - IPFS hash (CID)
 * @returns Parsed JSON object
 */
export async function fetchJSONFromIPFS(hash: string): Promise<any> {
    const url = getIPFSUrl(hash);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch JSON from IPFS: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('IPFS JSON fetch error:', error);
        throw error;
    }
}

/**
 * Check if IPFS is properly configured
 * @returns true if configured, false otherwise
 */
export function isIPFSConfigured(): boolean {
    return !!PINATA_JWT;
}
