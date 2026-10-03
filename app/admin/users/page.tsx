// app/admin/users/page.tsx
'use client';

import { useState } from 'react';
import { UserAccount, Role } from '@/types/cctv';
import { initialUsers } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Users, Plus, Edit2, Trash2, UserCheck, ShieldCheck, Mail } from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);
  
  // State Modal Pop-up (Buka/Tutup)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Form State
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('staff');
  const [department, setDepartment] = useState('Security Operational');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  // Reset Form Input
  const resetForm = () => {
    setIsEditing(null);
    setUsername('');
    setName('');
    setEmail('');
    setRole('staff');
    setDepartment('Security Operational');
    setStatus('active');
  };

  // Handler Buka Modal Tambah User Baru
  const handleOpenAddModal = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Handler Buka Modal Edit User
  const handleOpenEditModal = (user: UserAccount) => {
    setIsEditing(user.id);
    setUsername(user.username);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setDepartment(user.department);
    setStatus(user.status);
    setIsDialogOpen(true);
  };

  // Handler Simpan Data (Create / Update)
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      setUsers(
        users.map((u) =>
          u.id === isEditing ? { ...u, username, name, email, role, department, status } : u
        )
      );
    } else {
      const newUser: UserAccount = {
        id: `usr-${Date.now()}`,
        username,
        name,
        email,
        role,
        department,
        status,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setUsers([...users, newUser]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  // Handler Hapus User
  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus akun user ini?')) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman & Tombol Tambah User */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Management User & Pengguna</h1>
          <p className="text-slate-500 text-xs mt-1">
            Kelola akun akses staff security dan administrator IT portal CCTV.
          </p>
        </div>

        {/* Tombol pemicu Pop-Up Form */}
        <Button onClick={handleOpenAddModal} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
          <Plus className="w-4 h-4" /> Tambah User Baru
        </Button>
      </div>

      {/* Tabel Data User (Full Width) */}
      <Card className="bg-white shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" /> Daftar Akun Terdaftar ({users.length} Akun)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-4 border rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white hover:bg-slate-50 transition shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      u.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {u.role === 'admin' ? (
                      <ShieldCheck className="w-5 h-5" />
                    ) : (
                      <UserCheck className="w-5 h-5" />
                    )}
                  </div>

                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-800">{u.name}</span>
                      <span className="text-xs text-slate-400">(@{u.username})</span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{u.email}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {u.department} • Dibuat: {u.createdAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Badge
                    className={
                      u.role === 'admin'
                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-100'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                    }
                  >
                    {u.role.toUpperCase()}
                  </Badge>

                  <Badge variant={u.status === 'active' ? 'outline' : 'secondary'}>
                    {u.status === 'active' ? 'AKTIF' : 'NON-AKTIF'}
                  </Badge>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 hover:bg-slate-200"
                    onClick={() => handleOpenEditModal(u)}
                  >
                    <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 hover:bg-slate-200"
                    onClick={() => handleDelete(u.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* MODAL POP-UP FORM DIALOG (TAMBAH / EDIT USER) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {isEditing ? 'Edit Akun User' : 'Tambah Akun User Baru'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Isi rincian informasi pengguna di bawah ini.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveUser} className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-semibold">Username (Akses Login)</Label>
              <Input
                placeholder="misal: security03 / admin02"
                className="text-xs mt-1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Nama Lengkap</Label>
              <Input
                placeholder="misal: I Ketut Patroli"
                className="text-xs mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Alamat Email</Label>
              <Input
                type="email"
                placeholder="misal: ketut.security@grandhotel.com"
                className="text-xs mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Role Hak Akses</Label>
                <select
                  className="w-full p-2 border rounded-md text-xs mt-1 bg-white font-medium"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                >
                  <option value="staff">Staff Security</option>
                  <option value="admin">Admin IT</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold">Status Akun</Label>
                <select
                  className="w-full p-2 border rounded-md text-xs mt-1 bg-white font-medium"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Non-Aktif</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold">Departemen</Label>
              <Input
                placeholder="misal: Security Operational / IT Engineering"
                className="text-xs mt-1"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="pt-4 flex gap-2 justify-end">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                {isEditing ? 'Simpan Perubahan' : 'Tambah User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}