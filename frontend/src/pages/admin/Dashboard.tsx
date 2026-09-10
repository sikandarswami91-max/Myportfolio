import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { FolderGit2, FileText, PlusCircle, ExternalLink, Layers, Star, CheckCircle, TrendingUp } from 'lucide-react';
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

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 border border-neutral-800 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold font-heading text-white">Welcome back, Sikandar 👋</h2>
            <p className="text-neutral-400 text-sm mt-1 max-w-xl">
              Manage your live portfolio projects, update resume versions, and showcase your latest full-stack MERN achievements.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link
                to="/admin/projects/add"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Project</span>
              </Link>
              <Link
                to="/"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs border border-neutral-700 transition-colors"
              >
                <span>View Live Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Projects</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <FolderGit2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-heading text-white">{stats.totalProjects}</div>
            <p className="text-xs text-neutral-400 mt-1">In database catalog</p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Published</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-heading text-white">{stats.publishedProjects}</div>
            <p className="text-xs text-neutral-400 mt-1">Visible on live website</p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Featured</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Star className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-heading text-white">{stats.featuredProjects}</div>
            <p className="text-xs text-neutral-400 mt-1">Highlighted on homepage</p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Active Resume</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="text-base font-bold text-white truncate">{stats.resumeName}</div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Ready for download
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
