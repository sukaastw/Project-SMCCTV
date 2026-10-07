// app/admin/cctv/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { CCTV, CCTVStatus } from '@/types/cctv';
import { initialCCTVs } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Edit2,
  Trash2,
  Database,
  Search,
  X,
  FileSpreadsheet,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  RefreshCw,
  Layers,
  ChevronDown,
  Check,
} from 'lucide-react';

interface AlertNotification {
  type: 'success' | 'error' | 'info';
  message: string;
}

const LOCATION_CONFIG: { [key: string]: { prefix: string; floors: string[] } } = {
  'Main Building': {
    prefix: 'CAM-MB',
    floors: ['GF', 'LT1', 'LT2', 'LT3'],
  },
  'HWA': {
    prefix: 'CAM-HWA',
    floors: ['GF', 'LT2'],
  },
  'HWB': {
    prefix: 'CAM-HWB',
    floors: ['GF', 'LT2', 'LT3', 'Rooftop'],
  },
  'Caffe Toya': {
    prefix: 'CAM-CT',
    floors: ['GF'],
  },
  'Villa': {
    prefix: 'CAM-VIL',
    floors: ['GF', 'LT2'],
  },
  'Kitchen Samiya': {
    prefix: 'CAM-KS',
    floors: ['GF'],
  },
  'Outdoor': {
    prefix: 'CAM-OUT',
    floors: ['GF'],
  },
};

export default function MasterCCTVPage() {
  const [cctvs, setCCTVs] = useState<CCTV[]>([]);
  const [adminName, setAdminName] = useState('Admin IT');
  const [currentDate, setCurrentDate] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; code: string } | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [topAlert, setTopAlert] = useState<AlertNotification | null>(null);

  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [floor, setFloor] = useState('GF');
  const [cameraType, setCameraType] = useState('Dome 4MP');
  const [ipAddress, setIpAddress] = useState('');
  const [status, setStatus] = useState<CCTVStatus>('normal');
  const [damageNotes, setDamageNotes] = useState('');
  const [followUpPlan, setFollowUpPlan] = useState('');

  const [isLocDropdownOpen, setIsLocDropdownOpen] = useState(false);
  const [locInputText, setLocInputText] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const triggerTopAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setTopAlert({ type, message });
    setTimeout(() => {
      setTopAlert(null);
    }, 4000);
  };

  const loadMasterData = () => {
    const savedCCTVs = localStorage.getItem('cctv_master_data');
    if (savedCCTVs) {
      setCCTVs(JSON.parse(savedCCTVs));
    } else {
      setCCTVs(initialCCTVs);
      localStorage.setItem('cctv_master_data', JSON.stringify(initialCCTVs));
    }
  };

  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) setAdminName(savedName);

    loadMasterData();

    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLocDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateCodeForLocation = (locName: string, currentList: CCTV[] = cctvs) => {
    if (!locName) return 'CAM-01';
    const config = LOCATION_CONFIG[locName] || { prefix: 'CAM-LOC' };
    const prefix = config.prefix;
    const matchingCount = currentList.filter((item) => item.code.startsWith(prefix)).length;
    return `${prefix}-${String(matchingCount + 1).padStart(2, '0')}`;
  };

  const handleSelectLocation = (selectedLoc: string) => {
    setLocation(selectedLoc);
    setLocInputText(selectedLoc);
    setIsLocDropdownOpen(false);

    const availableFloors = LOCATION_CONFIG[selectedLoc]?.floors || ['GF'];
    setFloor(availableFloors[0]);

    if (!isEditing) {
      setCode(generateCodeForLocation(selectedLoc));
    }
  };

  const filteredCCTVs = cctvs.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      item.code.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      (item.floor && item.floor.toLowerCase().includes(query)) ||
      item.cameraType.toLowerCase().includes(query) ||
      item.ipAddress.toLowerCase().includes(query) ||
      (item.damageNotes && item.damageNotes.toLowerCase().includes(query)) ||
      (item.followUpPlan && item.followUpPlan.toLowerCase().includes(query))
    );
  });

  const filteredLocationKeys = Object.keys(LOCATION_CONFIG).filter((locKey) =>
    locKey.toLowerCase().includes(locInputText.toLowerCase().trim())
  );

  const handleExportExcel = () => {
    try {
      const headers = [
        'Kode CCTV',
        'Tipe Kamera',
        'Lokasi Area',
        'Lantai / Level',
        'IP Address',
        'Status',
        'Keterangan Rusak',
        'Rencana Tindak Lanjut',
        'Terakhir Diperiksa',
      ];
      const rows = filteredCCTVs.map((item) => [
        `"${item.code}"`,
        `"${item.cameraType}"`,
        `"${item.location}"`,
        `"${item.floor || 'GF'}"`,
        `"${item.ipAddress}"`,
        `"${item.status.toUpperCase()}"`,
        `"${item.damageNotes || '-'}"`,
        `"${item.followUpPlan || '-'}"`,
        `"${item.lastChecked}"`,
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Master_Data_CCTV_Homm_Saranam_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      triggerTopAlert('success', 'Laporan Excel (.CSV) berhasil diunduh ke perangkat Anda.');
    } catch {
      triggerTopAlert('error', 'Gagal mengunduh laporan Excel.');
    }
  };

  const handleExportPDF = () => {
    triggerTopAlert('info', 'Mempersiapkan dokumen cetak HOMM Saranam Baturiti...');
    window.print();
  };

  const resetForm = () => {
    setIsEditing(null);
    setLocation('');
    setLocInputText('');
    setFloor('GF');
    setCode('');
    setCameraType('Dome 4MP');
    setIpAddress('');
    setStatus('normal');
    setDamageNotes('');
    setFollowUpPlan('');
    setIsLocDropdownOpen(false);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEditModal = (cctv: CCTV) => {
    setIsEditing(cctv.id);
    setCode(cctv.code);
    setLocation(cctv.location);
    setLocInputText(cctv.location);
    setFloor(cctv.floor || 'GF');
    setCameraType(cctv.cameraType);
    setIpAddress(cctv.ipAddress);
    setStatus(cctv.status);
    setDamageNotes(cctv.damageNotes || '');
    setFollowUpPlan(cctv.followUpPlan || '');
    setIsLocDropdownOpen(false);
    setIsDialogOpen(true);
  };

  const handleSaveCCTV = (e: React.FormEvent) => {
    e.preventDefault();

    const finalLocation = location || locInputText;
    if (!finalLocation) {
      triggerTopAlert('error', 'Pilih atau ketik lokasi area terlebih dahulu!');
      return;
    }

    try {
      let updatedList: CCTV[] = [];
      if (isEditing) {
        updatedList = cctvs.map((item) =>
          item.id === isEditing
            ? {
                ...item,
                code: code || generateCodeForLocation(finalLocation),
                location: finalLocation,
                floor,
                cameraType,
                ipAddress,
                status,
                damageNotes,
                followUpPlan,
              }
            : item
        );
        triggerTopAlert('success', `Berhasil! Data unit CCTV ${code} telah diperbarui.`);
      } else {
        const finalCode = code || generateCodeForLocation(finalLocation);
        const newCCTV: CCTV = {
          id: `cctv-${Date.now()}`,
          code: finalCode,
          location: finalLocation,
          floor,
          cameraType,
          ipAddress,
          status,
          damageNotes,
          followUpPlan,
          lastChecked: new Date().toISOString().slice(0, 10),
        };
        updatedList = [...cctvs, newCCTV];
        triggerTopAlert('success', `Berhasil! Unit CCTV ${finalCode} baru telah ditambahkan.`);
      }

      setCCTVs(updatedList);
      localStorage.setItem('cctv_master_data', JSON.stringify(updatedList));
      setIsDialogOpen(false);
      resetForm();
    } catch {
      triggerTopAlert('error', 'Terjadi kesalahan sistem saat menyimpan data.');
    }
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      try {
        const updatedList = cctvs.filter((item) => item.id !== deleteTarget.id);
        setCCTVs(updatedList);
        localStorage.setItem('cctv_master_data', JSON.stringify(updatedList));
        triggerTopAlert('success', `Unit CCTV ${deleteTarget.code} berhasil dihapus dari inventaris!`);
      } catch {
        triggerTopAlert('error', `Gagal menghapus unit CCTV ${deleteTarget.code}.`);
      } finally {
        setDeleteTarget(null);
      }
    }
  };

  const confirmResetData = () => {
    try {
      localStorage.removeItem('cctv_master_data');
      loadMasterData();
      triggerTopAlert('info', 'Data Master CCTV telah disinkronkan kembali ke versi terbaru.');
    } catch {
      triggerTopAlert('error', 'Gagal menyinkronkan data.');
    } finally {
      setIsResetDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {topAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 transition-all duration-300 animate-in fade-in slide-in-from-top-4 print:hidden">
          <div
            className={`p-3.5 rounded-xl border shadow-xl flex items-center justify-between gap-3 text-xs font-semibold ${
              topAlert.type === 'success'
                ? 'bg-green-600 border-green-700 text-white shadow-green-200'
                : topAlert.type === 'error'
                ? 'bg-red-600 border-red-700 text-white shadow-red-200'
                : 'bg-blue-600 border-blue-700 text-white shadow-blue-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {topAlert.type === 'success' && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
              {topAlert.type === 'error' && <AlertTriangle className="w-5 h-5 text-white shrink-0" />}
              {topAlert.type === 'info' && <Info className="w-5 h-5 text-white shrink-0" />}
              <span>{topAlert.message}</span>
            </div>

            <button onClick={() => setTopAlert(null)} className="text-white/80 hover:text-white p-1 rounded-md">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header Utama Layar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Master Data Unit CCTV</h1>
          <p className="text-slate-500 text-xs mt-1">
            HOMM Saranam Baturiti — Kelola inventaris seluruh unit CCTV, tipe kamera, lokasi & lantai, serta IP address.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-auto shrink-0">
          <Button
            onClick={() => setIsResetDialogOpen(true)}
            variant="outline"
            className="h-9 px-3 text-xs font-medium text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900 gap-1.5 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Sync</span>
          </Button>

          <Button
            onClick={handleExportExcel}
            variant="outline"
            className="h-9 px-3 text-xs font-medium border-emerald-600 text-emerald-700 hover:bg-emerald-50 gap-1.5 shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Excel</span>
          </Button>

          <Button
            onClick={handleExportPDF}
            variant="outline"
            className="h-9 px-3 text-xs font-medium border-purple-600 text-purple-700 hover:bg-purple-50 gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-purple-600" />
            <span>Cetak / Export PDF</span>
          </Button>

          <Button
            onClick={handleOpenAddModal}
            className="h-9 px-3.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Unit CCTV</span>
          </Button>
        </div>
      </div>

      {/* KOP LAPORAN CETAK MASTER DATA RESMI */}
      <div className="hidden print:block mb-6 border-b-2 border-black pb-4 text-black">
        <div className="flex items-center justify-between border-b border-black pb-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Homm Saranam Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold uppercase tracking-widest">HOMM SARANAM BATURITI</h2>
              <p className="text-[10px] uppercase font-semibold text-gray-700">A Banyan Group Escape • Tabanan, Bali</p>
            </div>
          </div>
          <div className="text-right text-[10px]">
            <p className="font-bold">IT DEPARTMENT & SECURITY MAINTENANCE</p>
            <p>Jl. Raya Baturiti, Baturiti, Tabanan, Bali 82191</p>
          </div>
        </div>

        <div className="text-center my-2">
          <h3 className="text-sm font-bold uppercase tracking-wide">LAPORAN MASTER DATA INVENTARIS PERANGKAT CCTV</h3>
        </div>

        <div className="mt-3 pt-2 border-t border-black text-xs grid grid-cols-2 gap-y-1">
          <div>
            <span className="font-semibold">Dicetak Oleh:</span> {adminName} (Administrator IT)
          </div>
          <div className="text-right">
            <span className="font-semibold">Tanggal Report:</span> {currentDate} WITA
          </div>
          <div>
            <span className="font-semibold">Total Perangkat:</span> {filteredCCTVs.length} Unit CCTV
          </div>
          <div className="text-right">
            <span className="font-semibold">Status Dokumen:</span> RESMI / AUDIT IT HOMM SARANAM
          </div>
        </div>
      </div>

      {/* CARD KONTEN UTAMA TABEL */}
      <Card className="bg-white shadow-sm border-slate-200 print:shadow-none print:border-none print:rounded-none print:bg-transparent">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 print:hidden">
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-600" /> Inventaris Perangkat CCTV ({filteredCCTVs.length} Dari {cctvs.length} Unit)
          </CardTitle>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Cari kode, lokasi, lantai, tipe, IP..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 text-xs bg-slate-50 border-slate-200 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-4 p-0 md:p-6 print:p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-slate-200 print:border-black">
              <thead>
                <tr className="bg-slate-100 text-slate-800 print:bg-gray-200 print:text-black border-b border-slate-200 print:border-black font-bold uppercase text-[11px] print:text-[10px]">
                  <th className="p-2.5 border border-slate-200 print:border-black text-center w-10">No</th>
                  <th className="p-2.5 border border-slate-200 print:border-black">Kode CCTV</th>
                  <th className="p-2.5 border border-slate-200 print:border-black">Tipe Kamera</th>
                  <th className="p-2.5 border border-slate-200 print:border-black">Lokasi Area & Lantai</th>
                  <th className="p-2.5 border border-slate-200 print:border-black">IP Address</th>
                  <th className="p-2.5 border border-slate-200 print:border-black text-center">Status</th>
                  <th className="p-2.5 border border-slate-200 print:border-black">Keterangan Rusak</th>
                  <th className="p-2.5 border border-slate-200 print:border-black">Rencana Tindak Lanjut</th>
                  <th className="p-2.5 border border-slate-200 print:border-black text-center print:hidden">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCCTVs.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-6 text-center text-slate-500 italic">
                      Tidak ada data unit CCTV yang sesuai dengan pencarian "{searchQuery}".
                    </td>
                  </tr>
                ) : (
                  filteredCCTVs.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition border-b border-slate-200 print:border-black text-slate-800 print:text-black">
                      <td className="p-2.5 border border-slate-200 print:border-black text-center font-medium">{index + 1}</td>
                      <td className="p-2.5 border border-slate-200 print:border-black font-bold text-slate-900 print:text-black">{item.code}</td>
                      <td className="p-2.5 border border-slate-200 print:border-black text-slate-700 print:text-black font-medium">{item.cameraType}</td>
                      <td className="p-2.5 border border-slate-200 print:border-black">
                        <div className="font-bold text-slate-800 print:text-black">{item.location}</div>
                        <div className="text-[11px] text-purple-700 print:text-gray-700 font-semibold flex items-center gap-1 mt-0.5">
                          <Layers className="w-3 h-3 text-purple-600 print:hidden" />
                          <span>Lantai: {item.floor || 'GF'}</span>
                        </div>
                      </td>
                      <td className="p-2.5 border border-slate-200 print:border-black font-mono text-slate-700 print:text-black">{item.ipAddress}</td>
                      <td className="p-2.5 border border-slate-200 print:border-black text-center">
                        <Badge
                          className={
                            item.status === 'normal'
                              ? 'bg-green-100 text-green-700 hover:bg-green-100 print:bg-transparent print:text-black print:p-0 print:border-none print:font-bold'
                              : item.status === 'broken'
                              ? 'bg-red-100 text-red-700 hover:bg-red-100 print:bg-transparent print:text-black print:p-0 print:border-none print:font-bold'
                              : item.status === 'maintenance'
                              ? 'bg-purple-100 text-purple-700 hover:bg-purple-100 print:bg-transparent print:text-black print:p-0 print:border-none print:font-bold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-100 print:bg-transparent print:text-black print:p-0 print:border-none print:font-bold'
                          }
                        >
                          {item.status === 'normal'
                            ? 'NORMAL'
                            : item.status === 'broken'
                            ? 'RUSAK'
                            : item.status === 'maintenance'
                            ? 'MAINTENANCE'
                            : 'OFFLINE'}
                        </Badge>
                      </td>
                      <td className="p-2.5 border border-slate-200 print:border-black text-slate-700 print:text-black">{item.damageNotes || '-'}</td>
                      <td className="p-2.5 border border-slate-200 print:border-black text-slate-700 print:text-black">{item.followUpPlan || '-'}</td>
                      <td className="p-2.5 border border-slate-200 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 hover:bg-slate-200"
                            onClick={() => handleOpenEditModal(item)}
                          >
                            <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 hover:bg-slate-200"
                            onClick={() => setDeleteTarget({ id: item.id, code: item.code })}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="hidden print:grid grid-cols-2 gap-8 mt-12 text-xs text-black">
            <div className="text-center space-y-14">
              <p>Dilaporkan Oleh,</p>
              <p className="font-bold underline uppercase">( {adminName} )</p>
              <p className="text-[10px] -mt-12 text-gray-600">Admin IT HOMM Saranam Baturiti</p>
            </div>
            <div className="text-center space-y-14">
              <p>Disetujui Oleh,</p>
              <p className="font-bold underline uppercase">( ............................................ )</p>
              <p className="text-[10px] -mt-12 text-gray-600">Head of IT Department</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MODAL DIALOG KONFIRMASI HAPUS CUSTOM */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open: boolean) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-white rounded-xl max-w-md p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Konfirmasi Hapus Unit CCTV
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-600 mt-2">
              Apakah Anda yakin ingin menghapus unit <strong className="text-slate-900">{deleteTarget?.code}</strong> dari inventaris HOMM Saranam Baturiti?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2 justify-end">
            <AlertDialogCancel className="text-xs">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white text-xs"
            >
              Ya, Hapus Unit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* MODAL DIALOG KONFIRMASI SYNC / RESET DATA CUSTOM */}
      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent className="bg-white rounded-xl max-w-md p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-purple-600" />
              Sinkronkan Ulang Data Master
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-600 mt-2">
              Apakah Anda yakin ingin menyinkronkan ulang seluruh data Master CCTV dengan data awal sistem HOMM Saranam Baturiti?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2 justify-end">
            <AlertDialogCancel className="text-xs">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmResetData}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
            >
              Ya, Sinkronkan Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* MODAL POP-UP FORM DIALOG INPUT LENGKAP */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white p-6 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {isEditing ? 'Edit Data CCTV' : 'Tambah Unit CCTV Baru'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Isi rincian inventaris HOMM Saranam Baturiti, lokasi area, lantai, tipe kamera, dan status.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveCCTV} className="space-y-3.5 py-1">
            <div className="space-y-1 relative" ref={dropdownRef}>
              <Label className="text-xs font-semibold">Pilih Lokasi Area (Ketik / Pilih Dropdown)</Label>
              <div className="relative">
                <Input
                  placeholder="Ketik atau pilih lokasi..."
                  className="text-xs bg-slate-50 font-semibold text-slate-800 pr-10 focus:bg-white"
                  value={locInputText}
                  onFocus={() => setIsLocDropdownOpen(true)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const typed = e.target.value;
                    setLocInputText(typed);
                    setLocation(typed);
                    setIsLocDropdownOpen(true);
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsLocDropdownOpen(!isLocDropdownOpen)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {isLocDropdownOpen && (
                <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto py-1">
                  {filteredLocationKeys.length === 0 ? (
                    <div className="p-2.5 text-xs text-slate-400 italic text-center">
                      Tidak ada lokasi "{locInputText}"
                    </div>
                  ) : (
                    filteredLocationKeys.map((locKey) => {
                      const isSelected = location === locKey;
                      return (
                        <button
                          key={locKey}
                          type="button"
                          onClick={() => handleSelectLocation(locKey)}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-purple-50 transition ${
                            isSelected ? 'bg-purple-50 font-bold text-purple-700' : 'text-slate-700'
                          }`}
                        >
                          <span>{locKey} <span className="text-[10px] text-slate-400 font-normal">({LOCATION_CONFIG[locKey].prefix})</span></span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-purple-600" />}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Pilih Lantai / Level</Label>
                <select
                  className="w-full p-2 border border-slate-300 rounded-md text-xs mt-1 bg-white font-bold text-purple-700"
                  value={floor}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFloor(e.target.value)}
                  required
                >
                  {(LOCATION_CONFIG[location]?.floors || ['GF']).map((fl) => (
                    <option key={fl} value={fl}>
                      Lantai: {fl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold flex items-center justify-between">
                  <span>Kode CCTV (Auto)</span>
                  {!isEditing && location && (
                    <button
                      type="button"
                      onClick={() => setCode(generateCodeForLocation(location))}
                      className="text-[10px] text-purple-600 hover:underline flex items-center gap-0.5"
                    >
                      <Sparkles className="w-3 h-3" /> Auto
                    </button>
                  )}
                </Label>
                <Input
                  placeholder="misal: CAM-MB-01"
                  className="text-xs mt-1 font-bold text-purple-700 bg-purple-50/50"
                  value={code}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Tipe Kamera</Label>
                <Input
                  placeholder="misal: Dome 4MP / PTZ 360 / Bullet"
                  className="text-xs mt-1"
                  value={cameraType}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCameraType(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">IP Address Perangkat</Label>
                <Input
                  placeholder="misal: 192.168.10.25"
                  className="text-xs mt-1 font-mono"
                  value={ipAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIpAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold">Status Keadaan</Label>
              <select
                className="w-full p-2 border rounded-md text-xs mt-1 bg-white font-medium"
                value={status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as CCTVStatus)}
              >
                <option value="normal">Normal / Hidup</option>
                <option value="broken">Broken / Rusak</option>
                <option value="maintenance">In Maintenance</option>
                <option value="offline">Offline / Mati</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Keterangan yang Rusak / Detail Kendala</Label>
              <Textarea
                placeholder="misal: Gambar no-signal, adaptor 12V mati total..."
                className="text-xs mt-1 h-16"
                value={damageNotes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDamageNotes(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Rencana Tindak Lanjut</Label>
              <Input
                placeholder="misal: Penggantian power supply & krimping ulang connector"
                className="text-xs mt-1"
                value={followUpPlan}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFollowUpPlan(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-3 flex gap-2 justify-end">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                {isEditing ? 'Simpan Perubahan' : 'Tambah Unit'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}