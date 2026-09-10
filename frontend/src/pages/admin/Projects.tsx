import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  Filter,
  RefreshCw,
  FolderKanban,
  CheckCircle,
  FileClock,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProjectCard, AdminProjectItem } from '../../components/admin/ProjectCard';
import { DeleteModal } from '../../components/admin/DeleteModal';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

export const Projects: React.FC = () => {
  const { showToast } = useToast();

  const [projects, setProjects] = useState<AdminProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'featured'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Delete modal state
  const [projectToDelete, setProjectToDelete] = useState<AdminProjectItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/projects');
      if (res.data?.success) {
        setProjects(res.data.data);
      }
    } catch {
      showToast('Failed to retrieve projects list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter and Search logic
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Status filter
      if (statusFilter === 'published' && !p.published) return false;
      if (statusFilter === 'draft' && p.published) return false;
      if (statusFilter === 'featured' && !p.featured) return false;

      // Category filter
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.title?.toLowerCase().includes(query);
        const matchesDesc = p.shortDescription?.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query);
        const matchesTech = p.technologies?.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesTech) return false;
      }

      return true;
    });
  }, [projects, statusFilter, categoryFilter, searchQuery]);

  // Pagination slices
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(start, start + itemsPerPage);
  }, [filteredProjects, currentPage, itemsPerPage]);

  const handleTogglePublish = async (project: AdminProjectItem) => {
    try {
      const id = project._id || project.id;
      const newStatus = !project.published;
      await api.patch(`/api/admin/projects/${id}/publish`, { published: newStatus });

      setProjects((prev) =>
        prev.map((p) => (p._id === id || p.id === id ? { ...p, published: newStatus } : p))
      );

      showToast(`Project moved to ${newStatus ? 'Published' : 'Draft'}`, 'info');
    } catch {
      showToast('Failed to toggle publish status.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    const id = projectToDelete._id || projectToDelete.id;
    setIsDeleting(true);

    try {
      await api.delete(`/api/admin/projects/${id}`);
      showToast('Project deleted successfully.', 'success');
      setProjects((prev) => prev.filter((p) => p._id !== id && p.id !== id));
      setProjectToDelete(null);
    } catch {
      showToast('Failed to delete project.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  return (
    <AdminLayout title="Project Management">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            Portfolio Projects
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Manage your showcase applications, descriptions, technologies, and public availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProjects}
            disabled={loading}
            className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <Link
            to="/admin/projects/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:from-cyan-400 hover:to-blue-500 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Projects', count: projects.length },
            { id: 'published', label: 'Published', count: projects.filter((p) => p.published).length },
            { id: 'draft', label: 'Drafts', count: projects.filter((p) => !p.published).length },
            { id: 'featured', label: 'Featured', count: projects.filter((p) => p.featured).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id as any);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                statusFilter === tab.id
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-300">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Category Select */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Category dropdown */}
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          {/* Search box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search title, tech..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-800 bg-neutral-950 text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Projects Table Container */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 bg-neutral-950/40">
                <th className="py-3.5 px-4 sm:px-6">Project Info</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Category</th>
                <th className="py-3.5 px-4">Visibility</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">Featured</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Created</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProjects.map((project) => (
                <ProjectCard
                  key={project._id || project.id}
                  project={project}
                  onDelete={(p) => setProjectToDelete(p)}
                  onTogglePublish={handleTogglePublish}
                />
              ))}

              {paginatedProjects.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-neutral-500 text-sm">
                    No projects found matching the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="py-4 px-6 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
            <div>
              Showing page {currentPage} of {totalPages} ({filteredProjects.length} total)
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-neutral-800 hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-2 font-mono">{currentPage}</span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-neutral-800 hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
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
