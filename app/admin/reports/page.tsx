// app/admin/reports/page.tsx
'use client';

import { useState } from 'react';
import { TicketReport } from '@/types/cctv';
import { initialTickets } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Printer, FileSpreadsheet, FileCheck, Search, Wrench } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function MaintenanceReportsPage() {
  const [tickets] = useState<TicketReport[]>(initialTickets);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter laporan berdasarkan status dan query pencarian
  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesQuery =
      t.cctvCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.issueType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  // Handler untuk Cetak Laporan (Print to PDF / Printer)
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman & Aksik Cetak */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Laporan Maintenance & Perbaikan CCTV</h1>
          <p className="text-slate-500 text-xs mt-1">
            Rekapitulasi riwayat kerusakan, penanganan teknis IT, dan status audit operasional.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handlePrint} className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-2">
            <Printer className="w-4 h-4" /> Cetak Laporan (PDF)
          </Button>
        </div>
      </div>

      {/* FILTER & PENCARIAN (Disembunyikan saat dicetak) */}
      <Card className="bg-white shadow-sm border-slate-200 print:hidden">
        <CardContent className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Cari kode CCTV, lokasi, pelapor..."
              className="pl-9 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-600 shrink-0">Status:</span>
            <select
              className="p-2 border rounded-md text-xs bg-slate-50 font-medium w-full sm:w-auto"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending (Pending)</option>
              <option value="in_progress">Progres Perbaikan</option>
              <option value="resolved">Selesai (Resolved)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* TABEL DOKUMEN LAPORAN (AREA CETAK) */}
      <Card className="bg-white shadow-sm border-slate-200 print:shadow-none print:border-none">
        <CardHeader className="print:pb-2">
          <div className="hidden print:block mb-4 text-center border-b pb-4">
            <h2 className="text-xl font-bold uppercase text-slate-900">Grand Hotel CCTV Maintenance Audit Report</h2>
            <p className="text-xs text-slate-500 mt-0.5">Dokumen Resmi Rekapitulasi Penanganan & Perbaikan Perangkat CCTV</p>
          </div>

          <CardTitle className="text-base flex items-center gap-2 print:text-sm">
            <FileCheck className="w-5 h-5 text-purple-600 print:hidden" />
            Riwayat Laporan & Tindakan Perbaikan ({filteredTickets.length} Data)
          </CardTitle>
          <CardDescription className="text-xs print:hidden">
            Daftar lengkap audit perbaikan yang disaring berdasarkan kebutuhan audit IT.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase font-bold text-[11px]">
                  <th className="p-3">Kode CCTV</th>
                  <th className="p-3">Lokasi Unit</th>
                  <th className="p-3">Jenis Kendala</th>
                  <th className="p-3">Pelapor</th>
                  <th className="p-3">Tanggal Lapor</th>
                  <th className="p-3">Tindakan IT / Perbaikan</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-slate-500 italic">
                      Tidak ada data laporan maintenance yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{t.cctvCode}</td>
                      <td className="p-3 text-slate-700">{t.location}</td>
                      <td className="p-3 text-red-600 font-medium">{t.issueType}</td>
                      <td className="p-3 text-slate-600">{t.reporterName}</td>
                      <td className="p-3 text-slate-500 whitespace-nowrap">{t.reportedAt}</td>
                      <td className="p-3 text-slate-700">
                        {t.actionTaken ? (
                          <span className="font-mono text-slate-800">{t.actionTaken}</span>
                        ) : (
                          <span className="text-slate-400 italic">Belum ada catatan</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <Badge
                          className={
                            t.status === 'resolved'
                              ? 'bg-green-100 text-green-700 hover:bg-green-100'
                              : t.status === 'in_progress'
                              ? 'bg-purple-100 text-purple-700 hover:bg-purple-100'
                              : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                          }
                        >
                          {t.status === 'resolved'
                            ? 'SELESAI'
                            : t.status === 'in_progress'
                            ? 'PROGRES'
                            : 'PENDING'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Kolom Tanda Tangan Khusus Mode Cetak (Print) */}
          <div className="hidden print:grid grid-cols-2 gap-8 mt-12 pt-6 border-t text-xs">
            <div className="text-center space-y-12">
              <p>Dibuat Oleh (Staff Security),</p>
              <p className="font-bold underline">( .................................... )</p>
            </div>
            <div className="text-center space-y-12">
              <p>Disetujui Oleh (Admin IT Head),</p>
              <p className="font-bold underline">( .................................... )</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}