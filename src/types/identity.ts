export type RiskLevel = 'low' | 'medium' | 'high';
export type IdentityStatus = 'active' | 'revoked' | 'pending';
export type ConsentStatus = 'granted' | 'revoked' | 'expired';

export interface IdentityUsage {
  id: string;
  serviceName: string;
  serviceIcon: string;
  dateTime: Date;
  purpose: string;
  status: IdentityStatus;
  riskLevel: RiskLevel;
  category: string;
  dataShared: string[];
  lastAccessed: Date;
  offlineNote?: string;
}

export interface ConsentRecord {
  id: string;
  serviceName: string;
  serviceIcon: string;
  consentDate: Date;
  expiryDate?: Date;
  status: ConsentStatus;
  dataTypes: string[];
  blockchainHash: string;
  ipfsHash?: string;
  canRevoke: boolean;
  canDelete: boolean;
}

export interface BlockchainRecord {
  id: string;
  transactionHash: string;
  timestamp: Date;
  platform: string;
  action: string;
  consentStatus: ConsentStatus;
  blockNumber: number;
  verified: boolean;
  ipfsHash?: string;
  ipfsGateway?: string;
}

export interface DashboardStats {
  totalPlatforms: number;
  activePlatforms: number;
  revokedPlatforms: number;
  highRiskPlatforms: number;
  recentRegistrations: number;
  inactiveAccounts: number;
}

export interface SuspiciousAttempt {
  id: string;
  location: string;
  city: string;
  country: string;
  coordinates: { lat: number; lng: number };
  timestamp: Date;
  attemptType: 'login' | 'registration' | 'verification';
  platform: string;
  ipAddress: string;
  riskScore: number;
  blocked: boolean;
}
export interface HealthcareInstitution {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'specialist' | 'pharmacy' | 'lab';
  location: string;
  contactNumber: string;
  registeredDate: Date;
  isVerified: boolean;
}

export type MyKadAuditAction = 'registration' | 'record_access' | 'verification' | 'consent_approval' | 'emergency_access';
export type MyKadAuditStatus = 'approved' | 'denied' | 'pending' | 'emergency_used';

export interface MyKadAuditEvent {
  id: string;
  timestamp: Date;
  institution: HealthcareInstitution;
  action: MyKadAuditAction;
  purpose: string;
  status: MyKadAuditStatus;
  blockchainHash: string;
  blockNumber: number;
  verified: boolean;
  ipAddress?: string;
  location?: string;
  expiresAt?: Date;
}

export interface MyKadUsageConfirmationRequest {
  id: string;
  institution: HealthcareInstitution;
  action: MyKadAuditAction;
  purpose: string;
  timestamp: Date;
  location: string;
  expiresIn: number; // seconds
}