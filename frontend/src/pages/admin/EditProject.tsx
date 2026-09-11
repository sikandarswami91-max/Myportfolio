import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProjectForm, ProjectFormData } from '../../components/admin/ProjectForm';
import { Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

export const EditProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState<ProjectFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/api/projects/${id}`);
        if (res.data?.success && res.data.data) {
          setInitialData(res.data.data);
        } else {
          showToast('Project not found', 'error');
          navigate('/admin/projects');
        }
      } catch (err) {
        showToast('Failed to load project details', 'error');
        navigate('/admin/projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate, showToast]);

  return (
    <AdminLayout title="Edit Project">
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-cyan-600 dark:text-cyan-400 animate-spin" />
            <p className="text-sm text-slate-500 dark:text-neutral-400">Loading project data...</p>
          </div>
        ) : initialData ? (
          <ProjectForm initialData={initialData} isEditing={true} />
        ) : null}
      </div>
    </AdminLayout>
  );
};
