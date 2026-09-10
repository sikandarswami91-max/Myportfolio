import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// Public Pages
import { PublicHome } from './pages/PublicHome';
import { ProjectDetails } from './pages/ProjectDetails';
import { NotFound } from './pages/NotFound';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { Dashboard } from './pages/admin/Dashboard';
import { Projects } from './pages/admin/Projects';
import { AddProject } from './pages/admin/AddProject';
import { EditProject } from './pages/admin/EditProject';
import { ResumeManager } from './pages/admin/ResumeManager';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
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
                  <Projects />
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
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
