import React from 'react';
import { Navbar } from '@/components/navigation/navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-300" style={{ backgroundColor: 'var(--atomic-dark)' }}>
      <Navbar />
      <main className="container mx-auto px-4 py-6 atomic-fade-in">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
