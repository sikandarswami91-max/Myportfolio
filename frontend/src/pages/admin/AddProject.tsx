import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProjectForm } from '../../components/admin/ProjectForm';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export const AddProject: React.FC = () => {
  return (
    <AdminLayout title="Add New Project">
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
          Create New Project
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          Add a new application to your MERN portfolio. Project details and image will be securely saved.
        </p>
      </div>

      {/* Form Card */}
      <ProjectForm isEditing={false} />
    </AdminLayout>
  );
};
