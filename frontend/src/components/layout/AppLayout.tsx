import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const AppLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
