// app/admin/reports/page.tsx
'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Wrench, FileSpreadsheet, FileText } from 'lucide-react';
import { initialCCTVs, initialTickets } from '@/lib/mock-data';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ReportsPage() {
  // 1. Export Status Keadaan All CCTV
  const exportCCTVExcel = () => {
    const data = initialCCTVs.map((c) => ({
      'Kode CCTV': c.code,
      'Lokasi': c.location,
      'Zona': c.zone,
      'IP Address': c.ipAddress,
      'Kondisi Keadaan': c.status === 'normal' ? 'HIDUP / NORMAL' : 'MATI / RUSAK',
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Keadaan CCTV');
    XLSX.writeFile(workbook, `Report_Keadaan_CCTV_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportCCTVPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(15);
    doc.text('GRAND HOTEL - LAPORAN KONDISI KEADAAN ALL CCTV', 14, 15);
    const rows = initialCCTVs.map((c) => [c.code, c.location, c.zone, c.ipAddress, c.status.toUpperCase()]);
    autoTable(doc, {
      startY: 22,
      head: [['Kode', 'Lokasi', 'Zona', 'IP Address', 'Status']],
      body: rows,
    });
    doc.save(`Report_Keadaan_CCTV_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // 2. Export Progres Perbaikan Tiket
  const exportTicketExcel = () => {
    const data = initialTickets.map((t) => ({
      'Kode CCTV': t.cctvCode,
      'Pelapor': t.reporterName,
      'Kendala': t.issueType,
      'Progres': t.status.toUpperCase(),
      'Tgl Lapor': t.reportedAt,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Progres Perbaikan');
    XLSX.writeFile(workbook, `Report_Progres_Perbaikan_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportTicketPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(15);
    doc.text('GRAND HOTEL - LAPORAN PROGRES PERBAIKAN TIKET', 14, 15);
    const rows = initialTickets.map((t) => [t.cctvCode, t.reporterName, t.issueType, t.status.toUpperCase(), t.reportedAt]);
    autoTable(doc, {
      startY: 22,
      head: [['Kode CCTV', 'Pelapor', 'Kendala', 'Progres', 'Tgl Lapor']],
      body: rows,
    });
    doc.save(`Report_Progres_Perbaikan_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Audit & Tarik Laporan</h1>
        <p className="text-slate-500 text-xs mt-1">
          Unduh dokumen rekapitulasi resmi dalam format Excel atau PDF untuk kebutuhan audit hotel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-600" /> Laporan Condition & Keadaan All CCTV
            </CardTitle>
            <CardDescription className="text-xs">
              Merekap seluruh unit CCTV beserta status keadaannya (Hidup / Mati).
            </CardDescription>
            <div className="flex gap-2 pt-4">
              <Button size="sm" variant="outline" className="text-green-700 bg-white" onClick={exportCCTVExcel}>
                <FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> Excel Keadaan
              </Button>
              <Button size="sm" variant="outline" className="text-red-700 bg-white" onClick={exportCCTVPDF}>
                <FileText className="w-3.5 h-3.5 mr-1" /> PDF Keadaan
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-purple-200 bg-purple-50/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench className="w-5 h-5 text-purple-600" /> Laporan Progres Perbaikan Tiket
            </CardTitle>
            <CardDescription className="text-xs">
              Merekap tiket pelaporan masuk dan status progres penanganannya.
            </CardDescription>
            <div className="flex gap-2 pt-4">
              <Button size="sm" variant="outline" className="text-green-700 bg-white" onClick={exportTicketExcel}>
                <FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> Excel Progres
              </Button>
              <Button size="sm" variant="outline" className="text-red-700 bg-white" onClick={exportTicketPDF}>
                <FileText className="w-3.5 h-3.5 mr-1" /> PDF Progres
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}