import React, { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { AdminNavbar } from './AdminNavbar';
import { motion } from 'motion/react';
import { fadeIn } from '../../utils/animations';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync the app-wide theme (shared with the public site via the same localStorage key).
  // Light mode is the default; dark mode only when the user explicitly chose it.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem('theme');
    } catch {
      // ignore storage errors
    }
    document.documentElement.classList.toggle('dark', saved === 'dark');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 flex font-sans selection:bg-violet-500/25 selection:text-violet-700 dark:selection:text-violet-300 relative overflow-x-hidden">
      {/* Soft colorful ambient gradients (decorative only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-violet-300/30 dark:bg-violet-500/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-sky-300/30 dark:bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-pink-300/25 dark:bg-pink-500/10 blur-3xl" />
      </div>

      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 relative z-10">
        <AdminNavbar
          title={title}
          onOpenMobile={() => setMobileSidebarOpen(true)}
        />

        <motion.main
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};
