import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { PageLoader } from './components/PageLoader';

// Public Pages — PublicHome is eager so the landing page paints immediately
import { PublicHome } from './pages/PublicHome';

// Public Pages (code-split — each route loads its own chunk on demand)
const ProjectDetails = lazy(() =>
  import('./pages/ProjectDetails').then((m) => ({ default: m.ProjectDetails }))
);
const NotFound = lazy(() =>
  import('./pages/NotFound').then((m) => ({ default: m.NotFound }))
);

// Admin Pages (code-split — public visitors never download the admin system)
const AdminLogin = lazy(() =>
  import('./pages/admin/AdminLogin').then((m) => ({ default: m.AdminLogin }))
);
const Dashboard = lazy(() =>
  import('./pages/admin/Dashboard').then((m) => ({ default: m.Dashboard }))
);
const AdminProjects = lazy(() =>
  import('./pages/admin/Projects').then((m) => ({ default: m.Projects }))
);
const AddProject = lazy(() =>
  import('./pages/admin/AddProject').then((m) => ({ default: m.AddProject }))
);
const EditProject = lazy(() =>
  import('./pages/admin/EditProject').then((m) => ({ default: m.EditProject }))
);
const ResumeManager = lazy(() =>
  import('./pages/admin/ResumeManager').then((m) => ({ default: m.ResumeManager }))
);

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
            {/* Public Portfolio Routes */}
            <Route path="/" element={<PublicHome />} />
            <Route path="/about" element={<PublicHome />} />
            <Route path="/skills" element={<PublicHome />} />
            <Route path="/projects" element={<PublicHome />} />
            <Route path="/projects/:slug" element={<ProjectDetails />} />
            <Route path="/services" element={<PublicHome />} />
            <Route path="/experience" element={<PublicHome />} />
            <Route path="/education" element={<PublicHome />} />
            <Route path="/contact" element={<PublicHome />} />
            <Route path="/resume" element={<PublicHome />} />

            {/* Private Admin System */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/projects"
              element={
                <ProtectedRoute>
                  <AdminProjects />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/projects/add"
              element={
                <ProtectedRoute>
                  <AddProject />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/projects/edit/:id"
              element={
                <ProtectedRoute>
                  <EditProject />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/resume"
              element={
                <ProtectedRoute>
                  <ResumeManager />
                </ProtectedRoute>
              }
            />

            {/* 404 Not Found Fallback */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
