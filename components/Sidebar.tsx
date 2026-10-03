// components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Video, FileCheck, Users, Shield } from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export default function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard Monitoring',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Master Data CCTV',
      href: '/admin/cctv',
      icon: Video,
    },
    {
      label: 'Kelola User / Akun',
      href: '/admin/users',
      icon: Users,
    },
    {
      label: 'Audit & Tarik Report',
      href: '/admin/reports',
      icon: FileCheck,
    },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-full flex flex-col p-4 border-r border-slate-800">
      <div className="flex items-center gap-2 px-2 text-white font-bold text-lg border-b border-slate-800 pb-4 mb-6">
        <Shield className="h-6 w-6 text-purple-400" />
        <span>Hotel CCTV Admin</span>
      </div>

      <nav className="space-y-1">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Menu Utama
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}