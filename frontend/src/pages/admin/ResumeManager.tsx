import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DeleteModal } from '../../components/admin/DeleteModal';
import {
  FileText,
  UploadCloud,
  Download,
  Trash2,
  ExternalLink,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileCheck,
} from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

interface ResumeData {
  fileName: string;
  fileUrl: string;
  publicId?: string;
  updatedAt?: string | Date;
  createdAt?: string | Date;
}

export const ResumeManager: React.FC = () => {
  const { showToast } = useToast();

  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/resume');
      if (res.data?.success && res.data.data) {
        setResume(res.data.data);
      } else {
        setResume(null);
      }
    } catch {
      showToast('Failed to load resume details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        showToast('Please select a valid PDF document.', 'error');
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        showToast('PDF file size must not exceed 15MB.', 'error');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadResume = async () => {
    if (!selectedFile) {
      showToast('Please choose a PDF file first.', 'error');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);

      const res = await api.post('/api/admin/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success && res.data.data) {
        setResume(res.data.data);
        setSelectedFile(null);
        showToast('New resume PDF successfully published!', 'success');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to upload resume PDF';
      showToast(msg, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    setIsDeleting(true);

    try {
      await api.delete('/api/admin/resume');
      setResume(null);
      setShowDeleteModal(false);
      showToast('Resume removed successfully.', 'success');
    } catch {
      showToast('Failed to delete resume.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const lastUpdatedFormatted = resume?.updatedAt || resume?.createdAt
    ? new Date(resume.updatedAt || resume.createdAt!).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Default system document';

  return (
    <AdminLayout title="Resume Management">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            Curriculum Vitae (PDF)
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Manage the official resume available for recruiters and clients on your public portfolio.
          </p>
        </div>

        <button
          onClick={fetchResume}
          disabled={loading}
          className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors self-start sm:self-auto"
          title="Refresh resume status"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Resume Status */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Active Resume Document
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Currently linked on the public website
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  resume
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}
              >
                {resume ? 'Active' : 'Missing'}
              </span>
            </div>

            {resume ? (
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      File Name
                    </span>
                    <h4 className="text-sm font-semibold text-white truncate font-mono mt-0.5">
                      {resume.fileName}
                    </h4>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      File Format
                    </span>
                    <p className="text-xs text-cyan-400 font-mono font-medium mt-0.5">
                      application/pdf
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-400 pt-3 border-t border-neutral-800">
                  <Calendar className="w-4 h-4 text-neutral-500" />
                  <span>Last Updated: {lastUpdatedFormatted}</span>
                </div>

                {/* Resume Actions */}
                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors border border-neutral-700"
                  >
                    <ExternalLink className="w-4 h-4 text-cyan-400" />
                    <span>View in Browser</span>
                  </a>

                  <a
                    href="/api/resume/download"
                    download={resume.fileName}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold transition-colors border border-cyan-500/30"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </a>

                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors border border-rose-500/30 ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-neutral-950 border border-neutral-800 text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-sm font-semibold text-white">No active resume configured</p>
                <p className="text-xs text-neutral-500">
                  Upload your CV below to make it immediately downloadable on your portfolio.
                </p>
              </div>
            )}

            {/* Public integration note */}
            <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-neutral-300 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-cyan-400">Automatic Sync:</strong> The public portfolio's
                "Download CV" and "Preview CV" modal dynamically fetches this file from your backend
                API. Any uploaded replacement is instantly visible to all visitors.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Upload / Replace PDF */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                {resume ? 'Replace Resume PDF' : 'Upload Resume PDF'}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Upload your updated CV to Cloudinary & MongoDB storage.
              </p>
            </div>

            {/* Drag & Drop File Zone */}
            <div className="border-2 border-dashed border-neutral-700 hover:border-cyan-500/60 rounded-3xl p-6 text-center transition-colors bg-neutral-950/60 group">
              <input
                type="file"
                id="resume-upload"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              <label
                htmlFor="resume-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 group-hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-3 transition-colors">
                  <UploadCloud className="w-7 h-7" />
                </div>

                <span className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  Click to select PDF document
                </span>

                <span className="text-xs text-neutral-500 mt-1">
                  Only .pdf files up to 15MB are accepted
                </span>
              </label>
            </div>

            {/* Selected File Confirmation */}
            {selectedFile && (
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <FileCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate font-mono">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-xs text-neutral-400 hover:text-white px-2 py-1"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Upload Action */}
            <button
              onClick={handleUploadResume}
              disabled={!selectedFile || isUploading}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-900/30 disabled:opacity-50 transition-all"
            >
              {isUploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Publish New Resume PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        title="Delete Resume"
        itemName={resume?.fileName}
        itemType="resume"
        isDeleting={isDeleting}
        onConfirm={handleDeleteResume}
        onCancel={() => setShowDeleteModal(false)}
      />
    </AdminLayout>
  );
};
