// types/cctv.ts

export type Role = 'staff' | 'admin';
export type CCTVStatus = 'normal' | 'broken' | 'maintenance' | 'offline';
export type TicketStatus = 'pending' | 'in_progress' | 'resolved';

export interface CCTV {
  id: string;
  code: string;
  location: string;
  zone: string;
  ipAddress: string;
  status: CCTVStatus;
  lastChecked: string;
}

export interface TicketReport {
  id: string;
  cctvId: string;
  cctvCode: string;
  location: string;
  reporterName: string;
  issueType: string;
  description: string;
  status: TicketStatus;
  reportedAt: string;
  resolvedAt?: string;
  actionTaken?: string;
  photoUrl?: string;
}