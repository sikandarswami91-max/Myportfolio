import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  FolderGit2,
  FileText,
  PlusCircle,
  ExternalLink,
  Star,
  CheckCircle,
  Sparkles,
  ArrowRight,
  UploadCloud,
  TrendingUp,
} from 'lucide-react';
import api from '../../api/axios';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    featuredProjects: 0,
    resumeAvailable: false,
    resumeName: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projRes, resRes] = await Promise.all([
          api.get('/api/projects').catch(() => ({ data: { data: [] } })),
          api.get('/api/resume/active').catch(() => ({ data: { data: null } })),
        ]);

        const projects = projRes.data?.data || [];
        const activeResume = resRes.data?.data;

        setStats({
          totalProjects: projects.length,
          publishedProjects: projects.filter((p: any) => p.published !== false).length,
          featuredProjects: projects.filter((p: any) => p.featured).length,
          resumeAvailable: !!activeResume,
          resumeName: activeResume?.fileName || 'Default Resume',
        });
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: 'Total Projects',
      value: stats.totalProjects,
      caption: 'In database catalog',
      icon: FolderGit2,
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      ring: 'hover:ring-blue-400/40',
      glow: 'from-blue-500/20 to-cyan-500/10',
    },
    {
      label: 'Published',
      value: stats.publishedProjects,
      caption: 'Visible on live website',
      icon: CheckCircle,
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      ring: 'hover:ring-emerald-400/40',
      glow: 'from-emerald-500/20 to-green-500/10',
    },
    {
      label: 'Featured',
      value: stats.featuredProjects,
      caption: 'Highlighted on homepage',
      icon: Star,
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      ring: 'hover:ring-amber-400/40',
      glow: 'from-amber-500/20 to-orange-500/10',
    },
    {
      label: 'Active Resume',
      value: stats.resumeName,
      caption: 'Ready for download',
      icon: FileText,
      iconBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
      ring: 'hover:ring-violet-400/40',
      glow: 'from-violet-500/20 to-fuchsia-500/10',
      isText: true,
      active: stats.resumeAvailable,
    },
  ];
  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Colorful Welcome Hero */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 p-6 sm:p-8 text-white shadow-xl shadow-violet-500/20"
        >
          <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 right-1/3 w-64 h-64 rounded-full bg-pink-400/20 blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-[11px] font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admin Control Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight">
              Welcome back, Sikandar ??
            </h2>
            <p className="text-white/80 text-sm mt-2 max-w-xl leading-relaxed">
              Manage your live portfolio projects, update resume versions, and showcase your latest
              full-stack MERN achievements.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <Link
                to="/admin/projects/add"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-violet-700 font-semibold text-xs shadow-md hover:bg-violet-50 hover:-translate-y-0.5 transition-all duration-200"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Project</span>
              </Link>
              <Link
                to="/admin/resume"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 hover:bg-white/25 text-white font-semibold text-xs transition-all duration-200 hover:-translate-y-0.5"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Manage Resume</span>
              </Link>
              <Link
                to="/"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 hover:bg-white/25 text-white font-semibold text-xs transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>View Live Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-slate-500 dark:text-neutral-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Portfolio Metrics
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {statCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.08 * idx, ease: 'easeOut' }}
                  whileHover={{ y: -4 }}
                  className={`p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 ring-1 ring-transparent ${card.ring} shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group`}
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.glow} opacity-80`} />

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                      {card.label}
                    </span>
                    <div className={`p-2 rounded-xl ${card.iconBg} transition-transform duration-200 group-hover:scale-110`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {card.isText ? (
                    <div className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {card.value}
                    </div>
                  ) : (
                    <div className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                      {card.value}
                    </div>
                  )}

                  {card.isText ? (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                      {card.caption}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                      {card.caption}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm">
          <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white mb-1">
            Quick Actions
          </h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
            Jump straight into the most common admin tasks.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/admin/projects/add"
              className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 dark:border-blue-500/10 hover:border-blue-500/40 transition-all hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  Add Project
                </span>
              </span>
              <ArrowRight className="w-4 h-4 text-blue-500 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/admin/projects"
              className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 dark:border-emerald-500/10 hover:border-emerald-500/40 transition-all hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  Manage Projects
                </span>
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-500 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/admin/resume"
              className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20 dark:border-violet-500/10 hover:border-violet-500/40 transition-all hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  Resume Manager
                </span>
              </span>
              <ArrowRight className="w-4 h-4 text-violet-500 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
