import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProjectCard, AdminProjectItem } from '../../components/admin/ProjectCard';
import { DeleteModal } from '../../components/admin/DeleteModal';
import { PlusCircle, Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<AdminProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [projectToDelete, setProjectToDelete] = useState<AdminProjectItem | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const { showToast } = useToast();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/projects');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
      showToast('Failed to load projects from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/api/projects/${id}/publish`, { published: !currentStatus });
      setProjects((prev) =>
        prev.map((p) => (p._id === id || p.id === id ? { ...p, published: !currentStatus } : p))
      );
      showToast(`Project ${!currentStatus ? 'published' : 'hidden'} successfully`, 'success');
    } catch (err) {
      showToast('Failed to update publish state', 'error');
    }
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/api/projects/${id}/featured`, { featured: !currentStatus });
      setProjects((prev) =>
        prev.map((p) => (p._id === id || p.id === id ? { ...p, featured: !currentStatus } : p))
      );
      showToast(`Featured state updated`, 'success');
    } catch (err) {
      showToast('Failed to update featured state', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    const targetId = projectToDelete._id || projectToDelete.id;
    setDeleting(true);
    try {
      await api.delete(`/api/projects/${targetId}`);
      setProjects((prev) => prev.filter((p) => (p._id || p.id) !== targetId));
      showToast('Project deleted successfully', 'success');
      setDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch (err) {
      showToast('Failed to delete project', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.technologies && p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <AdminLayout title="Projects Management">
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-2 px-3 text-sm rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Categories</option>
              <option value="Full-Stack MERN">Full-Stack MERN</option>
              <option value="Frontend Application">Frontend Application</option>
              <option value="Backend API & Tool">Backend API & Tool</option>
            </select>
          </div>

          <Link
            to="/admin/projects/add"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Project</span>
          </Link>
        </div>

        {/* Project Cards Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <p className="text-sm text-neutral-400">Loading catalog...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/30">
            <AlertCircle className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No projects found</h3>
            <p className="text-sm text-neutral-400 mt-1">Try adjusting your search query or category filters.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500">
                  <th className="py-3 px-4 sm:px-6 font-semibold">Project</th>
                  <th className="py-3 px-4 hidden md:table-cell font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 hidden lg:table-cell font-semibold">Featured</th>
                  <th className="py-3 px-4 hidden sm:table-cell font-semibold">Created</th>
                  <th className="py-3 px-4 sm:px-6 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project._id || project.id}
                    project={project}
                    onDelete={() => {
                      setProjectToDelete(project);
                      setDeleteModalOpen(true);
                    }}
                    onTogglePublish={() =>
                      handleTogglePublish(project._id || project.id!, project.published !== false)
                    }
                    onToggleFeatured={() =>
                      handleToggleFeatured(project._id || project.id!, !!project.featured)
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        title="Delete Project"
        itemName={projectToDelete?.title}
        itemType="project"
        isDeleting={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setProjectToDelete(null);
        }}
      />
    </AdminLayout>
  );
};
