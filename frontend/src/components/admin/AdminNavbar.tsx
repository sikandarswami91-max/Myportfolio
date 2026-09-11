import React, { useState, useEffect } from 'react';
import { Menu, Database, Cloud, LogOut, Plus, ExternalLink, RefreshCw, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

interface AdminNavbarProps {
  onOpenMobile: () => void;
  title: string;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ onOpenMobile, title }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [dbInfo, setDbInfo] = useState<{ connected: boolean; label: string } | null>(null);
  const [cloudInfo, setCloudInfo] = useState<{ configured: boolean; label: string } | null>(null);
  const [isDark, setIsDark] = useState<boolean>(
    () => typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await api.get('/api/auth/status');
      if (res.data?.success && res.data.status) {
        setDbInfo(res.data.status.database);
        setCloudInfo(res.data.status.cloudinary);
      }
    } catch {
      // Keep silent
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <header className="h-16 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-slate-200 dark:border-neutral-800 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Status Badges, Action Button & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* DB Status Badge */}
        {dbInfo && (
          <div
            className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              dbInfo.connected
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
            }`}
            title={dbInfo.label}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="max-w-[130px] truncate">{dbInfo.label}</span>
          </div>
        )}

        {/* Cloudinary Status Badge */}
        {cloudInfo && (
          <div
            className={`hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              cloudInfo.configured
                ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400'
                : 'bg-slate-100 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-neutral-400'
            }`}
            title={cloudInfo.label}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span className="max-w-[140px] truncate">{cloudInfo.label}</span>
          </div>
        )}

        {/* Theme Toggle (Light is default) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-amber-500 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-neutral-800 border border-slate-200 dark:border-neutral-700 transition-colors"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Quick Add Project */}
        <Link
          to="/admin/projects/add"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow hover:opacity-95 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </Link>

        {/* Admin Profile Chip */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-neutral-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-pink-500 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-fuchsia-500/20 ring-2 ring-white dark:ring-neutral-800">
            {admin?.email ? admin.email.charAt(0).toUpperCase() : 'A'}
          </div>
          <span className="hidden md:inline text-xs text-slate-600 dark:text-neutral-300 font-medium max-w-[140px] truncate">
            {admin?.email}
          </span>
        </div>

        {/* Direct Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-slate-500 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
