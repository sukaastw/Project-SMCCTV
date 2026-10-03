// app/admin/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { CCTV, TicketReport, TicketStatus } from '@/types/cctv';
import { initialCCTVs, initialTickets } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wrench, CheckCircle, Image as ImageIcon, Video, Power, AlertTriangle, Clock, Activity } from 'lucide-react';

export default function AdminDashboardPage() {
  const [cctvs] = useState<CCTV[]>(initialCCTVs);
  const [tickets, setTickets] = useState<TicketReport[]>(initialTickets);
  const [actionNotes, setActionNotes] = useState<{ [key: string]: string }>({});

  const handleUpdateTicketStatus = (
    ticketId: string,
    newStatus: TicketStatus
  ) => {
    setTickets(
      tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: newStatus,
              actionTaken: actionNotes[ticketId] || t.actionTaken,
              resolvedAt:
                newStatus === 'resolved'
                  ? new Date().toISOString().replace('T', ' ').slice(0, 16)
                  : undefined,
            }
          : t
      )
    );
  };

  // Perhitungan Ringkas Angka Indikator
  const totalKeseluruhan = cctvs.length;
  const totalHidup = cctvs.filter((c) => c.status === 'normal').length;
  const totalMati = cctvs.filter((c) => c.status !== 'normal').length;
  const butuhPenanganan = tickets.filter((t) => t.status === 'pending').length;
  const progresPerbaikan = tickets.filter((t) => t.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Monitoring CCTV</h1>
        <p className="text-slate-500 text-xs mt-1">
          Pemantauan real-time kondisi unit CCTV dan progres penanganan perbaikan.
        </p>
      </div>

      {/* CARD STATISTIK RINGKAS INDIKATOR UTAMA (5 COLUMN GRID) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total Keseluruhan */}
        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-slate-500 flex items-center justify-between">
              <span>Total Unit</span>
              <Video className="w-4 h-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-900">{totalKeseluruhan}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Semua Titik CCTV</p>
          </CardContent>
        </Card>

        {/* Kondisi Hidup */}
        <Card className="bg-white shadow-sm border-slate-200 border-t-2 border-t-green-500">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-slate-500 flex items-center justify-between">
              <span>Kondisi Hidup</span>
              <Power className="w-4 h-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-green-600">{totalHidup}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Normal / Operasional</p>
          </CardContent>
        </Card>

        {/* Kondisi Mati */}
        <Card className="bg-white shadow-sm border-slate-200 border-t-2 border-t-red-500">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-slate-500 flex items-center justify-between">
              <span>Kondisi Mati</span>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-red-600">{totalMati}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Rusak / Offline / Matot</p>
          </CardContent>
        </Card>

        {/* Butuh Penanganan */}
        <Card className="bg-white shadow-sm border-slate-200 border-t-2 border-t-amber-500">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-slate-500 flex items-center justify-between">
              <span>Penanganan</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-amber-600">{butuhPenanganan}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Laporan Baru (Pending)</p>
          </CardContent>
        </Card>

        {/* Progres Perbaikan */}
        <Card className="bg-white shadow-sm border-slate-200 border-t-2 border-t-purple-500">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-slate-500 flex items-center justify-between">
              <span>Progres</span>
              <Activity className="w-4 h-4 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-purple-600">{progresPerbaikan}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Dalam Perbaikan IT</p>
          </CardContent>
        </Card>
      </div>

      {/* DAFTAR TIKET PELAPORAN MASUK */}
      <Card className="bg-white shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Wrench className="w-5 h-5 text-purple-600" />
            Daftar Tiket Pelaporan Masuk & Update Progres
          </CardTitle>
          <CardDescription className="text-xs">
            Kelola tiket kerusakan dari staff dan perbarui catatan perbaikan teknis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <p className="text-sm text-slate-500 italic">Belum ada laporan kerusakan masuk.</p>
            ) : (
              tickets.map((t) => (
                <div key={t.id} className="p-4 border rounded-lg bg-white space-y-3 shadow-sm hover:border-slate-300 transition">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b pb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{t.cctvCode}</span>
                        <span className="text-sm text-slate-500">({t.location})</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Dilaporkan oleh: <span className="font-medium text-slate-700">{t.reporterName}</span> pada {t.reportedAt}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-bold text-slate-600">Status Progres:</Label>
                      <select
                        className="p-1.5 border rounded-md text-xs bg-slate-50 font-semibold cursor-pointer"
                        value={t.status}
                        onChange={(e) => handleUpdateTicketStatus(t.id, e.target.value as TicketStatus)}
                      >
                        <option value="pending">PENDING (Butuh Penanganan)</option>
                        <option value="in_progress">IN PROGRESS (Progres Perbaikan)</option>
                        <option value="resolved">RESOLVED (Selesai)</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700">
                    <p className="font-semibold text-red-600">{t.issueType}</p>
                    <p className="mt-1 bg-slate-50 p-2 rounded border text-slate-600 font-mono">
                      "{t.description}"
                    </p>
                  </div>

                  {t.photoUrl && (
                    <a
                      href={t.photoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 flex items-center gap-1 hover:underline font-medium"
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Lihat Lampiran Foto Bukti
                    </a>
                  )}

                  <div className="pt-1 space-y-1">
                    <Label className="text-xs font-medium text-slate-600">Catatan Perbaikan / Komponen yang Diperlukan:</Label>
                    <Input
                      placeholder="misal: Ganti adaptor 12V / Krimping RJ45..."
                      className="text-xs h-8"
                      value={actionNotes[t.id] || t.actionTaken || ''}
                      onChange={(e) => setActionNotes({ ...actionNotes, [t.id]: e.target.value })}
                    />
                  </div>

                  {t.resolvedAt && (
                    <div className="text-xs text-green-700 bg-green-50 p-2 rounded flex items-center gap-1 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" /> Selesai diperbaiki pada {t.resolvedAt}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}