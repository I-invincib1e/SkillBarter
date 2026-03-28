import { type ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <Header />
        <main className="pt-14 pb-20 md:pt-0 md:pb-0 md:pl-[220px] lg:pl-[260px]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            {children}
          </div>
        </main>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
