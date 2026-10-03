// types/cctv.ts

export type Role = 'staff' | 'admin';
export type CCTVStatus = 'normal' | 'broken' | 'maintenance' | 'offline';
export type TicketStatus = 'pending' | 'in_progress' | 'resolved';

export interface CCTV {
  id: string;
  code: string;
  location: string;
  cameraType: string; // Dome, Bullet, PTZ, Panoramic, dll.
  ipAddress: string;
  zone: string;
  status: CCTVStatus;
  damageNotes?: string; // Keterangan yang rusak
  followUpPlan?: string; // Rencana tindak lanjut
  documentationUrl?: string; // Status / Link foto dokumentasi
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

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  status: 'active' | 'inactive';
  createdAt: string;
}