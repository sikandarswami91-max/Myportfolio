import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProjectForm, ProjectFormData } from '../../components/admin/ProjectForm';
import { ChevronLeft, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

export const EditProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [projectData, setProjectData] = useState<ProjectFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/admin/projects/${id}`);
        if (res.data?.success && res.data.data) {
          const p = res.data.data;
          setProjectData({
            _id: p._id || p.id,
            title: p.title || '',
            slug: p.slug || '',
            shortDescription: p.shortDescription || '',
            description: p.description || '',
            image: p.image || '',
            technologies: p.technologies || [],
            githubUrl: p.githubUrl || '',
            liveUrl: p.liveUrl || '',
            category: p.category || 'Full Stack',
            featured: Boolean(p.featured),
            published: Boolean(p.published),
            accentColor: p.accentColor || '#06B6D4',
          });
        } else {
          showToast('Project not found.', 'error');
          navigate('/admin/projects');
        }
      } catch (err: any) {
        showToast('Failed to load project details.', 'error');
        navigate('/admin/projects');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, navigate, showToast]);

  return (
    <AdminLayout title="Edit Project">
      {/* Header Bar */}
      <div className="mb-6">
        <Link
          to="/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
          Edit Project: <span className="text-cyan-400">{projectData?.title || '...'}</span>
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          Update project specifications, tags, links, cover image, and live portfolio status.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-neutral-400">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
          <p className="text-sm">Loading project configuration...</p>
        </div>
      ) : projectData ? (
        <ProjectForm initialData={projectData} isEditing={true} />
      ) : null}
    </AdminLayout>
  );
};
