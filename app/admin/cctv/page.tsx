// app/admin/cctv/page.tsx
'use client';

import { useState } from 'react';
import { CCTV, CCTVStatus } from '@/types/cctv';
import { initialCCTVs } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit2, Trash2, Database } from 'lucide-react';

export default function MasterCCTVPage() {
  const [cctvs, setCCTVs] = useState<CCTV[]>(initialCCTVs);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [zone, setZone] = useState('Public Area');
  const [ipAddress, setIpAddress] = useState('');
  const [status, setStatus] = useState<CCTVStatus>('normal');

  const resetForm = () => {
    setIsEditing(null);
    setCode('');
    setLocation('');
    setZone('Public Area');
    setIpAddress('');
    setStatus('normal');
  };

  const handleSaveCCTV = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setCCTVs(
        cctvs.map((item) =>
          item.id === isEditing ? { ...item, code, location, zone, ipAddress, status } : item
        )
      );
    } else {
      const newCCTV: CCTV = {
        id: Date.now().toString(),
        code,
        location,
        zone,
        ipAddress,
        status,
        lastChecked: new Date().toISOString().slice(0, 10),
      };
      setCCTVs([...cctvs, newCCTV]);
    }
    resetForm();
  };

  const handleEdit = (cctv: CCTV) => {
    setIsEditing(cctv.id);
    setCode(cctv.code);
    setLocation(cctv.location);
    setZone(cctv.zone);
    setIpAddress(cctv.ipAddress);
    setStatus(cctv.status);
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus unit CCTV ini?')) {
      setCCTVs(cctvs.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Master Data CCTV</h1>
        <p className="text-slate-500 text-xs mt-1">
          Kelola seluruh inventaris unit CCTV di semua titik hotel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Create / Edit */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {isEditing ? 'Edit Data CCTV' : 'Tambah Unit Baru'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveCCTV} className="space-y-3">
              <div>
                <Label className="text-xs">Kode CCTV</Label>
                <Input
                  placeholder="misal: CCTV-LBY-03"
                  className="text-xs"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Lokasi Detail</Label>
                <Input
                  placeholder="misal: Lift Tamu Lt. 2"
                  className="text-xs"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Zona Area</Label>
                <select
                  className="w-full p-2 border rounded-md text-xs mt-1 bg-white"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                >
                  <option value="Public Area">Public Area</option>
                  <option value="Guest Area">Guest Area</option>
                  <option value="Back of House">Back of House</option>
                  <option value="Perimeter & Parking">Perimeter & Parking</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">IP Address</Label>
                <Input
                  placeholder="misal: 192.168.10.25"
                  className="text-xs"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Status Keadaan</Label>
                <select
                  className="w-full p-2 border rounded-md text-xs mt-1 bg-white"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CCTVStatus)}
                >
                  <option value="normal">Normal / Hidup</option>
                  <option value="broken">Broken / Rusak</option>
                  <option value="maintenance">In Maintenance</option>
                  <option value="offline">Offline / Mati</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" size="sm" className="w-full bg-slate-900">
                  {isEditing ? 'Simpan Perubahan' : 'Tambah Unit'}
                </Button>
                {isEditing && (
                  <Button type="button" size="sm" variant="outline" onClick={resetForm}>
                    Batal
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tabel Master Data */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-1.5">
              <Database className="w-4 h-4 text-blue-600" /> All Data CCTV ({cctvs.length} Unit)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cctvs.map((item) => (
                <div
                  key={item.id}
                  className="p-3 border rounded-lg flex justify-between items-center bg-white hover:bg-slate-50 transition"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-800">
                      {item.code} <span className="font-normal text-slate-500">— {item.location}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Zona: <span className="font-medium text-slate-700">{item.zone}</span> | IP: {item.ipAddress}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={item.status === 'normal' ? 'outline' : 'destructive'}>
                      {item.status === 'normal' ? 'HIDUP' : 'MATI/RUSAK'}
                    </Badge>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(item)}>
                      <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}