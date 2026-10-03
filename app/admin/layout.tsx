// app/admin/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import AdminHeader from '@/components/AdminHeader';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [username, setUsername] = useState('Admin IT');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) setUsername(savedName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* 1. Sidebar Desktop (Hanya muncul di Layar Sedang & Besar: md:block) */}
      <aside className="hidden md:block w-64 fixed left-0 top-0 bottom-0 z-50">
        <Sidebar />
      </aside>

      {/* 2. Sidebar Mobile Drawer (Hanya terbuka ketika Tombol Hamburger diklik di layar kecil) */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-slate-900 border-r border-slate-800">
          <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* 3. Area Konten Utama (Berikan margin left md:ml-64 agar sejajar di layar besar) */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full">
        <AdminHeader
          username={username}
          onLogout={handleLogout}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}