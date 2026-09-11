import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { FileText, UploadCloud, Download, Trash2, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

export const ResumeManager: React.FC = () => {
  const [activeResume, setActiveResume] = useState<any>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const [activeRes, allRes] = await Promise.all([
        api.get('/api/resume/active').catch(() => ({ data: { data: null } })),
        api.get('/api/resume').catch(() => ({ data: { data: [] } })),
      ]);
      setActiveResume(activeRes.data?.data || null);
      setResumes(allRes.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showToast('Only PDF files are supported', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      const res = await api.post('/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showToast('Resume uploaded and activated successfully', 'success');
      fetchResumes();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to upload resume', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout title="Resume Management">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Upload Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xl">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading mb-2">Upload New Resume</h3>
          <p className="text-sm text-slate-500 dark:text-neutral-400 mb-6">
            Upload your latest resume in PDF format. This will automatically become the active resume for downloads.
          </p>

          <label className="border-2 border-dashed border-slate-200 dark:border-neutral-700 hover:border-cyan-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-neutral-950/50">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-cyan-600 dark:text-cyan-400 animate-spin" />
                <span className="text-sm text-slate-600 dark:text-neutral-300 font-medium">Uploading PDF to server...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mb-2">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Click or drag & drop resume PDF here</span>
                <span className="text-xs text-slate-500 dark:text-neutral-400">PDF up to 10MB</span>
              </div>
            )}
          </label>
        </div>

        {/* Current Active Resume */}
        <div className="p-6 rounded-2xl bg-white/70 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading mb-4">Current Active Resume</h3>
          {activeResume ? (
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-neutral-800/60 border border-slate-200 dark:border-neutral-700/60">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{activeResume.fileName || 'Active Resume'}</h4>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Currently active on public website
                  </span>
                </div>
              </div>

              <a
                href={activeResume.fileUrl || '/resume.pdf'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-700 dark:bg-neutral-700 hover:bg-slate-600 dark:hover:bg-neutral-600 text-white text-xs font-semibold transition-colors"
              >
                <span>View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-100/60 dark:bg-neutral-800/40 border border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400 text-sm">
              Default system resume is currently active (/resume.pdf).
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
