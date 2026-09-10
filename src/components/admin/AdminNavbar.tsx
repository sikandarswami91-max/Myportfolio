import React, { useState, useEffect } from 'react';
import { Menu, Database, Cloud, LogOut, Plus, ExternalLink, RefreshCw } from 'lucide-react';
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
    <header className="h-16 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold font-heading text-white tracking-tight">
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
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
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
                ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                : 'bg-neutral-800 border-neutral-700 text-neutral-400'
            }`}
            title={cloudInfo.label}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span className="max-w-[140px] truncate">{cloudInfo.label}</span>
          </div>
        )}

        {/* Quick Add Project */}
        <Link
          to="/admin/projects/add"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow hover:opacity-95 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </Link>

        {/* Admin Profile Chip */}
        <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
          <div className="w-8 h-8 rounded-xl bg-neutral-800 border border-neutral-700 text-cyan-400 font-bold text-xs flex items-center justify-center">
            {admin?.email ? admin.email.charAt(0).toUpperCase() : 'A'}
          </div>
          <span className="hidden md:inline text-xs text-neutral-300 font-medium max-w-[140px] truncate">
            {admin?.email}
          </span>
        </div>

        {/* Direct Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
