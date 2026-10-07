// components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@/types/cctv';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';

interface LoginFormProps {
  onLogin?: (role: Role, username: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      const detectedRole: Role = username.toLowerCase().includes('admin') ? 'admin' : 'staff';

      localStorage.setItem('user_role', detectedRole);
      localStorage.setItem('user_name', username);

      if (onLogin) {
        onLogin(detectedRole, username);
      }

      if (detectedRole === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/staff/report');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative">
      <Card className="w-full max-w-md bg-white border-slate-800 shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="text-center pb-2">
          {/* LOGO TANPA KOTAK & DIPERBESAR */}
          <div className="mx-auto w-36 h-16 flex items-center justify-center mb-2">
            <img
              src="/logo.png"
              alt="Homm Saranam Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <CardTitle className="text-xl font-bold text-slate-900 uppercase tracking-wide">
            Homm Saranam Baturiti
          </CardTitle>
          <CardDescription className="text-xs text-purple-600 font-semibold mt-0.5">
            CCTV Management System Portal
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="username" className="text-xs font-semibold text-slate-700">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-xs bg-slate-50 border-slate-200 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-xs bg-slate-50 border-slate-200 focus:bg-white"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold gap-2 shadow-sm mt-2"
            >
              <Lock className="w-4 h-4" /> Masuk ke Sistem
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* FOOTER LOGIN */}
      <div className="mt-6 text-center text-slate-500 text-xs">
        &copy; {new Date().getFullYear()} Homm Saranam Baturiti • IT Department
      </div>
    </div>
  );
}