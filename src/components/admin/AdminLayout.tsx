import React, { useState } from 'react';
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

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex font-sans selection:bg-cyan-500/25 selection:text-cyan-400">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
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
