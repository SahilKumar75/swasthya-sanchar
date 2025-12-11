'use client';

import { useState, useEffect } from 'react';
import { getIPFSUrl } from '@/lib/ipfs';

interface RecordViewerProps {
    recordHash: string;
    recordType?: string;
    metadata?: {
        doctor?: string;
        timestamp?: bigint;
        notes?: string;
    };
}

export default function RecordViewer({ recordHash, recordType, metadata }: RecordViewerProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [fileType, setFileType] = useState<'pdf' | 'image' | 'unknown'>('unknown');

    // Safety check for recordHash
    if (!recordHash) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-600">Error: No record hash provided</p>
            </div>
        );
    }

    const ipfsUrl = getIPFSUrl(recordHash);

    useEffect(() => {
        detectFileType();
    }, [recordHash]);

    const detectFileType = async () => {
        try {
            const response = await fetch(ipfsUrl, { method: 'HEAD' });
            const contentType = response.headers.get('content-type');

            if (contentType?.includes('pdf')) {
                setFileType('pdf');
            } else if (contentType?.includes('image')) {
                setFileType('image');
            } else {
                setFileType('unknown');
            }
            setLoading(false);
        } catch (err) {
            console.error('Error detecting file type:', err);
            setError('Failed to load record');
            setLoading(false);
        }
    };

    const handleDownload = () => {
        window.open(ipfsUrl, '_blank');
    };

    if (loading) {
        return (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-zinc-800 rounded w-1/4"></div>
                    <div className="h-64 bg-zinc-800 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold">Medical Record</h3>
                    {metadata?.timestamp && (
                        <p className="text-sm text-gray-400">
                            {new Date(Number(metadata.timestamp) * 1000).toLocaleDateString()}
                        </p>
                    )}
                </div>
                <button
                    onClick={handleDownload}
                    className="bg-white text-black px-4 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                    Download
                </button>
            </div>

            {/* Viewer */}
            <div className="p-4">
                {fileType === 'pdf' && (
                    <div className="space-y-4">
                        <iframe
                            src={ipfsUrl}
                            className="w-full h-[600px] border border-zinc-800 rounded"
                            title="PDF Viewer"
                        />
                        <p className="text-xs text-gray-500 text-center">
                            PDF viewer. If not loading, try downloading the file.
                        </p>
                    </div>
                )}

                {fileType === 'image' && (
                    <div className="space-y-4">
                        <img
                            src={ipfsUrl}
                            alt="Medical Record"
                            className="w-full rounded border border-zinc-800"
                        />
                    </div>
                )}

                {fileType === 'unknown' && (
                    <div className="text-center py-12 space-y-4">
                        <div className="text-4xl">📄</div>
                        <p className="text-gray-400">Unable to preview this file type</p>
                        <button
                            onClick={handleDownload}
                            className="bg-white text-black px-6 py-2 rounded font-medium hover:bg-gray-200 transition-colors"
                        >
                            Download File
                        </button>
                    </div>
                )}
            </div>

            {/* Metadata Sidebar */}
            {metadata && (
                <div className="p-4 border-t border-zinc-800 bg-black">
                    <h4 className="font-semibold text-sm mb-3">Record Details</h4>
                    <div className="space-y-2 text-sm">
                        {metadata.doctor && (
                            <div>
                                <span className="text-gray-400">Doctor:</span>
                                <p className="font-mono text-xs mt-1">{metadata.doctor}</p>
                            </div>
                        )}
                        {recordType && (
                            <div>
                                <span className="text-gray-400">Type:</span>
                                <p className="mt-1 capitalize">{recordType.replace('_', ' ')}</p>
                            </div>
                        )}
                        <div>
                            <span className="text-gray-400">IPFS Hash:</span>
                            <p className="font-mono text-xs mt-1 break-all">{recordHash}</p>
                        </div>
                        {metadata.notes && (
                            <div>
                                <span className="text-gray-400">Notes:</span>
                                <p className="mt-1">{metadata.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
