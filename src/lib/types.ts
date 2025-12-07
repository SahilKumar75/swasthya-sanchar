/**
 * Swasthya Sanchar - Type Definitions
 * Core TypeScript interfaces for the healthcare records system
 */

// ============================================================================
// Patient Types
// ============================================================================

/**
 * Registered patient on the blockchain
 */
export interface Patient {
    address: `0x${string}`;
    name: string;
    dateOfBirth: string;
    registeredAt: number;
    emergencyProfileHash: string;
}

/**
 * Patient registration input data
 */
export interface PatientRegistrationData {
    name: string;
    dateOfBirth: string;
    bloodType: BloodType;
    allergies: string[];
    conditions: string[];
    emergencyContact: EmergencyContact;
}

// ============================================================================
// Emergency Types
// ============================================================================

/**
 * Minimal emergency profile for QR-based access
 * This is visible to emergency responders without wallet
 */
export interface EmergencyProfile {
    name: string;
    bloodType: BloodType;
    allergies: string[];
    conditions: string[];
    emergencyContact: EmergencyContact;
}

/**
 * Emergency contact information
 */
export interface EmergencyContact {
    name: string;
    phone: string;
    relationship: string;
}

/**
 * Blood type enumeration
 */
export type BloodType =
    | 'A+' | 'A-'
    | 'B+' | 'B-'
    | 'AB+' | 'AB-'
    | 'O+' | 'O-'
    | 'Unknown';

// ============================================================================
// Health Record Types
// ============================================================================

/**
 * Health record stored off-chain
 */
export interface HealthRecord {
    id: string;
    patientAddress: `0x${string}`;
    type: RecordType;
    title: string;
    description: string;
    data: string; // Could be base64, IPFS hash, or JSON
    createdAt: number;
    updatedAt: number;
}

/**
 * Types of health records
 */
export type RecordType =
    | 'prescription'
    | 'lab_result'
    | 'diagnosis'
    | 'imaging'
    | 'vaccination'
    | 'allergy'
    | 'procedure'
    | 'other';

// ============================================================================
// Access Control Types
// ============================================================================

/**
 * Access grant record
 */
export interface AccessGrant {
    patientAddress: `0x${string}`;
    doctorAddress: `0x${string}`;
    grantedAt: number;
    isActive: boolean;
}

/**
 * Doctor with access information
 */
export interface Doctor {
    address: `0x${string}`;
    name?: string;
    specialty?: string;
}

// ============================================================================
// UI/App Types
// ============================================================================

/**
 * User roles in the application
 */
export type UserRole = 'patient' | 'doctor' | 'emergency';

/**
 * Wallet connection state
 */
export interface WalletState {
    isConnected: boolean;
    address: `0x${string}` | null;
    chainId: number | null;
    isConnecting: boolean;
    error: string | null;
}

/**
 * Transaction status for UI feedback
 */
export interface TransactionStatus {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    hash: `0x${string}` | null;
    error: string | null;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    total: number;
    page: number;
    pageSize: number;
}
