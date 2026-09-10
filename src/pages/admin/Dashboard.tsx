import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  FolderKanban,
  CheckCircle,
  FileClock,
  FileText,
  Plus,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProjectCard, AdminProjectItem } from '../../components/admin/ProjectCard';
import { DeleteModal } from '../../components/admin/DeleteModal';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { staggerContainer, slideUp } from '../../utils/animations';

export const Dashboard: React.FC = () => {
  const { showToast } = useToast();

  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    draftProjects: 0,
    featuredProjects: 0,
    hasResume: false,
    resumeInfo: null as any,
  });

  const [recentProjects, setRecentProjects] = useState<AdminProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [projectToDelete, setProjectToDelete] = useState<AdminProjectItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, projectsRes] = await Promise.all([
        api.get('/api/admin/projects/stats'),
        api.get('/api/admin/projects'),
      ]);

      if (statsRes.data?.success) {
        setStats(statsRes.data.stats);
      }

      if (projectsRes.data?.success) {
        // Show up to 5 most recent
        setRecentProjects(projectsRes.data.data.slice(0, 5));
      }
    } catch (err: any) {
      showToast('Failed to load dashboard metrics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleTogglePublish = async (project: AdminProjectItem) => {
    try {
      const id = project._id || project.id;
      const newStatus = !project.published;
      await api.patch(`/api/admin/projects/${id}/publish`, { published: newStatus });

      setRecentProjects((prev) =>
        prev.map((p) => (p._id === id || p.id === id ? { ...p, published: newStatus } : p))
      );

      setStats((prev) => ({
        ...prev,
        publishedProjects: newStatus ? prev.publishedProjects + 1 : prev.publishedProjects - 1,
        draftProjects: newStatus ? prev.draftProjects - 1 : prev.draftProjects + 1,
      }));

      showToast(`Project moved to ${newStatus ? 'Published' : 'Draft'}`, 'info');
    } catch {
      showToast('Failed to toggle publish state.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    const id = projectToDelete._id || projectToDelete.id;
    setIsDeleting(true);

    try {
      await api.delete(`/api/admin/projects/${id}`);
      showToast('Project deleted successfully.', 'success');
      setRecentProjects((prev) => prev.filter((p) => p._id !== id && p.id !== id));
      setStats((prev) => ({
        ...prev,
        totalProjects: Math.max(0, prev.totalProjects - 1),
        publishedProjects: projectToDelete.published
          ? Math.max(0, prev.publishedProjects - 1)
          : prev.publishedProjects,
        draftProjects: !projectToDelete.published
          ? Math.max(0, prev.draftProjects - 1)
          : prev.draftProjects,
      }));
      setProjectToDelete(null);
    } catch {
      showToast('Failed to delete project.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const cards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      subtitle: `${stats.featuredProjects} marked as Featured`,
      icon: FolderKanban,
      color: 'from-cyan-500/20 to-blue-600/20',
      iconColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
    },
    {
      title: 'Published Projects',
      value: stats.publishedProjects,
      subtitle: 'Visible to public visitors',
      icon: CheckCircle,
      color: 'from-emerald-500/20 to-teal-600/20',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
    },
    {
      title: 'Draft Projects',
      value: stats.draftProjects,
      subtitle: 'Private and unlisted',
      icon: FileClock,
      color: 'from-amber-500/20 to-orange-600/20',
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
    },
    {
      title: 'Resume Status',
      value: stats.hasResume ? 'Active' : 'Missing',
      subtitle: stats.resumeInfo?.fileName || 'Sikandar_Swami_Resume.pdf',
      icon: FileText,
      color: 'from-purple-500/20 to-indigo-600/20',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/30',
    },
  ];

  return (
    <AdminLayout title="Dashboard Overview">
      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            Welcome, Sikandar
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Real-time control for your portfolio projects, published visibility, and active curriculum vitae.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <Link
            to="/admin/projects/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:from-cyan-400 hover:to-blue-500 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10"
      >
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              variants={slideUp}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={`p-6 rounded-3xl bg-neutral-900/80 border ${card.borderColor} backdrop-blur-md relative overflow-hidden group shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  {card.title}
                </span>
                <div
                  className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${card.color} flex items-center justify-center ${card.iconColor}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="text-3xl font-extrabold font-heading text-white tracking-tight">
                {card.value}
              </div>

              <div className="text-xs text-neutral-400 mt-2 truncate font-mono">
                {card.subtitle}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent Projects Section */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold font-heading text-white tracking-tight">
              Recent Projects
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
              Latest additions to your portfolio repository.
            </p>
          </div>

          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                <th className="py-3 px-4 sm:px-6">Project</th>
                <th className="py-3 px-4 hidden md:table-cell">Category</th>
                <th className="py-3 px-4">Visibility</th>
                <th className="py-3 px-4 hidden lg:table-cell">Featured</th>
                <th className="py-3 px-4 hidden sm:table-cell">Created</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((project) => (
                <ProjectCard
                  key={project._id || project.id}
                  project={project}
                  onDelete={(p) => setProjectToDelete(p)}
                  onTogglePublish={handleTogglePublish}
                />
              ))}

              {recentProjects.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500 text-sm">
                    No projects found. Click "Add Project" to create your first portfolio project!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(projectToDelete)}
        title="Delete Project Confirmation"
        itemName={projectToDelete?.title}
        itemType="project"
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setProjectToDelete(null)}
      />
    </AdminLayout>
  );
};
