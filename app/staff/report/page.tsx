// app/staff/report/page.tsx
'use client';

import { useState } from 'react';
import { CCTV, TicketReport } from '@/types/cctv';
import { initialCCTVs, initialTickets } from '@/lib/mock-data';
import StaffView from '@/components/StaffView';

export default function StaffReportPage() {
  const [cctvs, setCCTVs] = useState<CCTV[]>(initialCCTVs);
  const [tickets, setTickets] = useState<TicketReport[]>(initialTickets);

  const handleReportSubmit = (newTicket: TicketReport, targetCCTVId: string) => {
    setTickets([newTicket, ...tickets]);
    setCCTVs(
      cctvs.map((c) => (c.id === targetCCTVId ? { ...c, status: 'broken' } : c))
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Form Lapor CCTV Rusak</h1>
        <p className="text-slate-500 text-xs mt-1">
          Laporkan kendala fisik atau tampilan gambar CCTV yang ditemukan saat patroli.
        </p>
      </div>

      <StaffView
        cctvs={cctvs}
        tickets={tickets}
        onSubmitReport={handleReportSubmit}
        defaultReporterName="Staff Security"
      />
    </div>
  );
}