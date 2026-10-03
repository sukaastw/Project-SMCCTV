// app/staff/reports/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { CCTV, TicketReport } from '@/types/cctv';
import { initialCCTVs, initialTickets } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Send, CheckCircle2, AlertTriangle, Upload, ImageIcon } from 'lucide-react';

export default function StaffReportPage() {
  const [cctvs, setCCTVs] = useState<CCTV[]>([]);
  const [tickets, setTickets] = useState<TicketReport[]>([]);
  
  // Form State Laporan Staff
  const [selectedCCTVId, setSelectedCCTVId] = useState('');
  const [issueType, setIssueType] = useState('Gambar No-Signal / Mati');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Muat data master CCTV terbaru
    const savedCCTVs = localStorage.getItem('cctv_master_data');
    if (savedCCTVs) {
      setCCTVs(JSON.parse(savedCCTVs));
    } else {
      setCCTVs(initialCCTVs);
    }

    const savedTickets = localStorage.getItem('cctv_tickets_data');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    } else {
      setTickets(initialTickets);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCCTVId) {
      setAlertMsg({ type: 'error', text: 'Pilih unit CCTV yang mengalami kendala!' });
      return;
    }

    if (!photoUrl) {
      setAlertMsg({ type: 'error', text: 'Wajib mengunggah foto bukti kendala!' });
      return;
    }

    const targetCCTV = cctvs.find((c) => c.id === selectedCCTVId);
    if (!targetCCTV) return;

    // 1. Buat Tiket Laporan Baru
    const newTicket: TicketReport = {
      id: `TKT-${Date.now()}`,
      cctvId: targetCCTV.id,
      cctvCode: targetCCTV.code,
      location: targetCCTV.location,
      reporterName: localStorage.getItem('user_name') || 'Staff Security',
      issueType,
      description,
      photoUrl,
      status: 'pending',
      reportedAt: new Date().toISOString().slice(0, 10),
    };

    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);
    localStorage.setItem('cctv_tickets_data', JSON.stringify(updatedTickets));

    // 2. OTOMATIS UBAH STATUS CCTV DI MASTER DATA MENJADI 'BROKEN' (RUSAK)
    const updatedCCTVs = cctvs.map((item) =>
      item.id === selectedCCTVId
        ? {
            ...item,
            status: 'broken' as const,
            damageNotes: `[Laporan Security]: ${issueType} - ${description}`,
            documentationUrl: photoUrl,
            lastChecked: new Date().toISOString().slice(0, 10),
          }
        : item
    );

    setCCTVs(updatedCCTVs);
    localStorage.setItem('cctv_master_data', JSON.stringify(updatedCCTVs));

    setAlertMsg({
      type: 'success',
      text: `Laporan untuk ${targetCCTV.code} berhasil dikirim! Status CCTV di Master Data otomatis berubah menjadi RUSAK.`,
    });

    // Reset Form
    setSelectedCCTVId('');
    setDescription('');
    setPhotoUrl('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Form Laporan Kendala CCTV</h1>
        <p className="text-slate-500 text-xs mt-1">
          Laporkan unit CCTV yang mengalami kerusakan atau gangguan operasional dari lapangan.
        </p>
      </div>

      {alertMsg && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
            alertMsg.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {alertMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{alertMsg.text}</span>
        </div>
      )}

      <Card className="bg-white shadow-sm border-slate-200">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-base font-bold text-slate-800">
            Buat Laporan Kerusakan
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleSubmitReport} className="space-y-4">
            <div>
              <Label className="text-xs font-semibold">Pilih Unit CCTV Kendala</Label>
              <select
                className="w-full p-2.5 border rounded-lg text-xs mt-1 bg-white font-medium"
                value={selectedCCTVId}
                onChange={(e) => setSelectedCCTVId(e.target.value)}
                required
              >
                <option value="">-- Pilih Kode & Lokasi CCTV --</option>
                {cctvs.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.code} — {item.location} ({item.status.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Jenis Kendala / Masalah</Label>
              <select
                className="w-full p-2.5 border rounded-lg text-xs mt-1 bg-white font-medium"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
              >
                <option value="Gambar No-Signal / Mati">Gambar No-Signal / Mati</option>
                <option value="Lensa Buram / Kotor">Lensa Buram / Kotor</option>
                <option value="Posisi Arah Berubah">Posisi Arah Berubah</option>
                <option value="Kabel / Connector Fisik Rusak">Kabel / Connector Fisik Rusak</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Rincian Deskripsi Kendala</Label>
              <Textarea
                placeholder="Tuliskan rincian kendala yang ditemukan..."
                className="text-xs mt-1 h-20"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-800">
                Upload Foto Bukti Kendala <span className="text-red-500">*</span>
              </Label>
              <div className="mt-1.5 flex items-center gap-3">
                <label className="flex-1 cursor-pointer border-2 border-dashed border-blue-200 hover:border-blue-500 bg-blue-50/50 p-3 rounded-lg flex items-center justify-center gap-2 transition text-xs font-semibold text-blue-700">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>{photoUrl ? 'Ganti Foto' : 'Pilih Foto Kendala'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    required={!photoUrl}
                  />
                </label>

                {photoUrl && (
                  <div className="w-12 h-12 rounded-lg border overflow-hidden shrink-0">
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs gap-2 py-2.5">
              <Send className="w-4 h-4" /> Kirim Laporan Kendala
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}