import { RiskLevel } from '@/types/identity';

export interface TollTransaction {
  id: string;
  tollPlaza: string;
  highway: string;
  state: string;
  dateTime: Date;
  transactionType: string;
  amount: number;
  riskLevel: RiskLevel;
  coordinates: { lat: number; lng: number };
  isNewSinceLost?: boolean;
}

export const userHomeLocation = {
  lat: 3.1390,
  lng: 101.6869,
  city: 'Kuala Lumpur'
};

export const mockTollTransactions: TollTransaction[] = [
  {
    id: 'toll-001',
    tollPlaza: 'Plaza Tol Sungai Besi',
    highway: 'BESRAYA',
    state: 'Selangor',
    dateTime: new Date('2024-12-19T08:15:00'),
    transactionType: 'Touch \'n Go via MyKad',
    amount: 1.60,
    riskLevel: 'low',
    coordinates: { lat: 3.0738, lng: 101.7082 }
  },
  {
    id: 'toll-002',
    tollPlaza: 'Plaza Tol Kajang',
    highway: 'PLUS',
    state: 'Selangor',
    dateTime: new Date('2024-12-19T09:45:00'),
    transactionType: 'Touch \'n Go via MyKad',
    amount: 2.10,
    riskLevel: 'low',
    coordinates: { lat: 2.9927, lng: 101.7909 }
  },
  {
    id: 'toll-003',
    tollPlaza: 'Plaza Tol Seremban',
    highway: 'PLUS',
    state: 'Negeri Sembilan',
    dateTime: new Date('2024-12-19T11:20:00'),
    transactionType: 'Touch \'n Go via MyKad',
    amount: 5.30,
    riskLevel: 'medium',
    coordinates: { lat: 2.7297, lng: 101.9381 }
  },
  {
    id: 'toll-004',
    tollPlaza: 'Plaza Tol Melaka',
    highway: 'PLUS',
    state: 'Melaka',
    dateTime: new Date('2024-12-19T14:30:00'),
    transactionType: 'Touch \'n Go via MyKad',
    amount: 8.50,
    riskLevel: 'medium',
    coordinates: { lat: 2.1896, lng: 102.2501 },
    isNewSinceLost: true
  },
  {
    id: 'toll-005',
    tollPlaza: 'Plaza Tol Tangkak',
    highway: 'PLUS',
    state: 'Johor',
    dateTime: new Date('2024-12-19T16:45:00'),
    transactionType: 'Touch \'n Go via MyKad',
    amount: 6.20,
    riskLevel: 'high',
    coordinates: { lat: 2.2667, lng: 102.5456 },
    isNewSinceLost: true
  },
  {
    id: 'toll-006',
    tollPlaza: 'Plaza Tol Johor Bahru',
    highway: 'PLUS',
    state: 'Johor',
    dateTime: new Date('2024-12-19T19:00:00'),
    transactionType: 'Touch \'n Go via MyKad',
    amount: 12.40,
    riskLevel: 'high',
    coordinates: { lat: 1.4927, lng: 103.7414 },
    isNewSinceLost: true
  },
  {
    id: 'toll-007',
    tollPlaza: 'Plaza Tol Skudai',
    highway: 'Senai-Desaru Expressway',
    state: 'Johor',
    dateTime: new Date('2024-12-20T02:15:00'),
    transactionType: 'Touch \'n Go via MyKad',
    amount: 4.80,
    riskLevel: 'high',
    coordinates: { lat: 1.5382, lng: 103.6401 },
    isNewSinceLost: true
  }
];

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
