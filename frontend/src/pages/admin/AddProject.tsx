import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProjectForm } from '../../components/admin/ProjectForm';

export const AddProject: React.FC = () => {
  return (
    <AdminLayout title="Add New Project">
      <div className="max-w-4xl mx-auto">
        <ProjectForm isEditing={false} />
      </div>
    </AdminLayout>
  );
};
