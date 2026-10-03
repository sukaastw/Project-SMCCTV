// lib/mock-data.ts
import { CCTV, TicketReport } from '@/types/cctv';

export const initialCCTVs: CCTV[] = [
  { id: '1', code: 'CCTV-LBY-01', location: 'Lobby Utama - Reception', zone: 'Public Area', ipAddress: '192.168.10.11', status: 'normal', lastChecked: '2026-10-03' },
  { id: '2', code: 'CCTV-LBY-02', location: 'Lobby Utama - Entrance Door', zone: 'Public Area', ipAddress: '192.168.10.12', status: 'broken', lastChecked: '2026-10-03' },
  { id: '3', code: 'CCTV-FL1-01', location: 'Koridor Lt 1 - Room 101-110', zone: 'Guest Area', ipAddress: '192.168.10.21', status: 'normal', lastChecked: '2026-10-02' },
  { id: '4', code: 'CCTV-BOH-01', location: 'Main Kitchen - Hot Line Area', zone: 'Back of House', ipAddress: '192.168.20.05', status: 'maintenance', lastChecked: '2026-10-03' },
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