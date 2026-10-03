// components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@/types/cctv';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-slate-700 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
            <Shield className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-800">Grand Hotel CCTV System</CardTitle>
          <CardDescription>Masukkan kredensial akun Anda untuk masuk</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white">
              <Lock className="w-4 h-4 mr-2" /> Masuk ke Sistem
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}