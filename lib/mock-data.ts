// lib/mock-data.ts
import { CCTV, TicketReport } from '@/types/cctv';
import { UserAccount } from '@/types/cctv';

export const initialCCTVs: CCTV[] = [
  {
    id: 'cctv-1',
    code: 'CCTV-PA-01',
    location: 'Lobby Utama - Reception',
    cameraType: 'Dome 4MP',
    ipAddress: '192.168.10.11',
    zone: 'Public Area',
    status: 'normal',
    damageNotes: 'Tidak Ada (Operasional Normal)',
    followUpPlan: 'Pemeliharaan Rutin Bulanan',
    documentationUrl: 'https://placehold.co/600x400/png?text=Dokumentasi+CCTV+Normal',
    lastChecked: '2026-10-03',
  },
  {
    id: 'cctv-2',
    code: 'CCTV-PA-02',
    location: 'Lobby Utama - Entrance Door',
    cameraType: 'Bullet Outdoor 5MP',
    ipAddress: '192.168.10.12',
    zone: 'Public Area',
    status: 'broken',
    damageNotes: 'Gambar No-Signal, Adaptor Mati',
    followUpPlan: 'Penggantian Power Supply 12V 2A',
    documentationUrl: 'https://placehold.co/600x400/png?text=Foto+Kamera+Rusak',
    lastChecked: '2026-10-03',
  },
  {
    id: 'cctv-3',
    code: 'CCTV-GA-01',
    location: 'Koridor Lt 1 - Room 101-110',
    cameraType: 'Dome IR 2MP',
    ipAddress: '192.168.10.21',
    zone: 'Guest Area',
    status: 'normal',
    damageNotes: 'Tidak Ada',
    followUpPlan: 'Monitoring Rutin',
    documentationUrl: '',
    lastChecked: '2026-10-02',
  },
  {
    id: 'cctv-4',
    code: 'CCTV-BOH-01',
    location: 'Main Kitchen - Hot Line Area',
    cameraType: 'PTZ Speed Dome 360',
    ipAddress: '192.168.20.05',
    zone: 'Back of House',
    status: 'maintenance',
    damageNotes: 'Lensa Buram Kena Uap Minyak',
    followUpPlan: 'Pembersihan Lensa & Re-Housing Protection',
    documentationUrl: 'https://placehold.co/600x400/png?text=Foto+Lensa+Buram',
    lastChecked: '2026-10-03',
  },
];


export const initialTickets: TicketReport[] = [
  {
    id: 'TCK-1001',
    cctvId: '2',
    cctvCode: 'CCTV-LBY-02',
    location: 'Lobby Utama - Entrance Door',
    reporterName: 'Budi (Security)',
    issueType: 'No Video / Display Matot',
    description: 'Layar monitor hanya menampilkan gambar hitam sejak pukul 08.00 pagi.',
    status: 'pending',
    reportedAt: '2026-10-03 08:30',
  }
];

export const initialUsers: UserAccount[] = [
  {
    id: 'usr-1',
    username: 'admin',
    name: 'Admin IT Principal',
    email: 'admin.it@grandhotel.com',
    role: 'admin',
    department: 'IT & Engineering',
    status: 'active',
    createdAt: '2026-01-10',
  },
  {
    id: 'usr-2',
    username: 'security01',
    name: 'I Made Security',
    email: 'made.security@grandhotel.com',
    role: 'staff',
    department: 'Security Operational',
    status: 'active',
    createdAt: '2026-02-15',
  },
  {
    id: 'usr-3',
    username: 'security02',
    name: 'Wayan Patrol',
    email: 'wayan.patrol@grandhotel.com',
    role: 'staff',
    department: 'Security Operational',
    status: 'active',
    createdAt: '2026-03-01',
  },
];