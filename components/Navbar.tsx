// components/Navbar.tsx
'use client';

import { Role } from '@/types/cctv';
import { Shield, UserCheck, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

export default function Navbar({ currentRole, onRoleChange }: NavbarProps) {
  return (
    <header className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-2 font-bold text-lg">
        <Shield className="h-6 w-6 text-blue-400" />
        <span>Grand Hotel - CCTV System</span>
      </div>
      <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
        <Button
          size="sm"
          variant={currentRole === 'staff' ? 'default' : 'ghost'}
          onClick={() => onRoleChange('staff')}
          className="text-xs"
        >
          <UserCheck className="w-4 h-4 mr-1" /> Staff / Security
        </Button>
        <Button
          size="sm"
          variant={currentRole === 'admin' ? 'default' : 'ghost'}
          onClick={() => onRoleChange('admin')}
          className="text-xs"
        >
          <Settings className="w-4 h-4 mr-1" /> Admin IT
        </Button>
      </div>
    </header>
  );
}