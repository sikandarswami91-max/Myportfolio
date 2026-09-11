import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Code2,
  Award,
  FileText,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { ThemeMode } from '../types';
import api from '../api/axios';
import { downloadResumeFile } from '../utils/downloadResume';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, theme }) => {
  const isDark = theme === 'dark';
  const [activeResume, setActiveResume] = useState<{ fileName: string; fileUrl: string; isDefault?: boolean } | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'text'>('preview');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  useEffect(() => {
    const fetchActiveResume = async () => {
      try {
        const res = await api.get('/api/resume');
        if (res.data?.success && res.data.data) {
          setActiveResume(res.data.data);
        }
      } catch {
        // Silently use defaults
      }
    };

    if (isOpen) {
      fetchActiveResume();
      setViewMode('preview');
      setZoomLevel(100);
    }
  }, [isOpen]);

  const resumePdfUrl = activeResume?.fileUrl || '/resume.pdf';
  const downloadFileName = activeResume?.fileName || 'Sikandar_Swami_Resume.pdf';

  const handleDownload = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await downloadResumeFile('Sikandar_Bharti_Resume.pdf', '/api/resume/download');
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl z-10 overflow-hidden border ${
              isDark
                ? 'bg-neutral-900 border-neutral-800 text-neutral-100'
                : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            {/* Header bar */}
            <div
              className={`flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b ${
                isDark ? 'bg-neutral-900/95 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className={`text-xs sm:text-sm font-semibold tracking-wide font-heading ${
                    isDark ? 'text-white' : 'text-neutral-700'
                  }`}>
                    Original Resume
                  </span>
                </div>

                {/* View Switcher Tabs */}
                <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-xs">
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                      viewMode === 'preview'
                        ? 'bg-white dark:bg-neutral-700 text-cyan-600 dark:text-cyan-400 shadow-sm'
                        : isDark ? 'text-[#A8B3C2] hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Original Document</span>
                  </button>
                  <button
                    onClick={() => setViewMode('text')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                      viewMode === 'text'
                        ? 'bg-white dark:bg-neutral-700 text-cyan-600 dark:text-cyan-400 shadow-sm'
                        : isDark ? 'text-[#A8B3C2] hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Text View</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons: Open New Tab + Download + Close */}
              <div className="flex items-center gap-2">
                <a
                  href={resumePdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    isDark
                      ? 'border-neutral-700 hover:bg-neutral-800 text-[#E2E8F0]'
                      : 'border-neutral-300 hover:bg-neutral-100 text-neutral-700'
                  }`}
                  title="Open PDF in new browser tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Open Fullscreen</span>
                </a>

                {/* Direct Native PDF Download Button */}
                <button
                  id="resume-modal-download-btn"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm hover:opacity-95 transition-opacity disabled:opacity-75 cursor-pointer"
                  title="Download verified resume PDF"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download CV</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onClose}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isDark
                      ? 'border-neutral-700 hover:bg-neutral-800 text-[#E2E8F0] hover:text-white'
                      : 'border-neutral-200 hover:bg-neutral-100 text-neutral-500 hover:text-black'
                  }`}
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile View Switcher */}
            <div className="flex sm:hidden items-center justify-center p-1.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/50">
              <div className="flex items-center p-0.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-xs w-full max-w-xs justify-center">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1 rounded-md font-medium transition-all ${
                    viewMode === 'preview'
                      ? 'bg-white dark:bg-neutral-700 text-cyan-600 dark:text-cyan-400 shadow-sm'
                      : isDark ? 'text-[#A8B3C2]' : 'text-neutral-500'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Document View</span>
                </button>
                <button
                  onClick={() => setViewMode('text')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1 rounded-md font-medium transition-all ${
                    viewMode === 'text'
                      ? 'bg-white dark:bg-neutral-700 text-cyan-600 dark:text-cyan-400 shadow-sm'
                      : isDark ? 'text-[#A8B3C2]' : 'text-neutral-500'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Text View</span>
                </button>
              </div>
            </div>

            {/* Modal Body: Document View or Structured Text View */}
            {viewMode === 'preview' ? (
              <div className="relative w-full h-[68vh] sm:h-[72vh] bg-neutral-950 flex flex-col overflow-hidden">
                {/* Document Control Bar */}
                <div className="flex items-center justify-between px-3 sm:px-5 py-2 border-b border-neutral-800/80 bg-neutral-900/90 text-xs text-neutral-300 select-none z-10 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#E2E8F0]">Page 1 of 1</span>
                    <span className="text-neutral-600 hidden sm:inline">•</span>
                    <span className="font-mono text-cyan-400 hidden sm:inline">{zoomLevel}% scale</span>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => setZoomLevel((prev) => Math.max(70, prev - 15))}
                      className="p-1 sm:px-2 sm:py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors inline-flex items-center gap-1"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Zoom Out</span>
                    </button>
                    <button
                      onClick={() => setZoomLevel(100)}
                      className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors inline-flex items-center gap-1 text-xs"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Fit</span>
                    </button>
                    <button
                      onClick={() => setZoomLevel((prev) => Math.min(160, prev + 15))}
                      className="p-1 sm:px-2 sm:py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors inline-flex items-center gap-1"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Zoom In</span>
                    </button>
                  </div>
                </div>

                {/* Document Canvas Container */}
                <div className="flex-1 overflow-auto p-2 sm:p-6 flex justify-center items-start bg-neutral-950/90">
                  <div
                    style={{
                      width: zoomLevel === 100 ? '100%' : `${zoomLevel}%`,
                      maxWidth: zoomLevel === 100 ? '780px' : 'none',
                    }}
                    className="transition-all duration-150 shadow-2xl rounded-sm overflow-hidden bg-white border border-neutral-700/60 my-auto"
                  >
                    <img
                      src="/resume-preview.png"
                      alt="Sikandar Swami Original Resume Document"
                      className="w-full h-auto block select-none pointer-events-auto"
                      loading="eager"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm leading-relaxed max-h-[72vh]">
                {/* Profile Header */}
                <div className="border-b pb-6 border-neutral-200 dark:border-neutral-800">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                    <div>
                      <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight font-heading ${
                        isDark ? 'text-white' : 'text-neutral-900'
                      }`}>
                        SIKANDAR
                      </h2>
                      <p className="text-base font-medium text-cyan-600 dark:text-cyan-400 mt-0.5">
                        MERN Stack Developer
                      </p>
                    </div>
                    <div className={`flex flex-wrap gap-y-1 gap-x-4 text-xs ${
                      isDark ? 'text-[#E2E8F0]' : 'text-neutral-500'
                    }`}>
                      <span className="inline-flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-cyan-500" />
                        sikandarswami@91gmail.com
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-cyan-500" />
                        +91 9198431459
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                        Lucknow, India
                      </span>
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-3">
                    <GraduationCap className="w-4 h-4" />
                    Education
                  </h3>
                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-neutral-800/80 border-neutral-700' : 'bg-neutral-50 border-neutral-200'}`}>
                    <div className={`flex flex-col sm:flex-row sm:justify-between font-semibold ${
                      isDark ? 'text-white' : 'text-neutral-900'
                    }`}>
                      <span>Maharishi University Of Information Technology</span>
                      <span className="text-xs text-cyan-500 font-mono sm:self-center">Lucknow, India</span>
                    </div>
                    <div className={`flex flex-col sm:flex-row sm:justify-between text-xs mt-1 ${
                      isDark ? 'text-[#E2E8F0]' : 'text-neutral-500'
                    }`}>
                      <span>Bachelor of Computer Application – Software Engineer</span>
                      <span className="font-mono">September 2023 – 2026</span>
                    </div>
                  </div>
                </div>

                {/* Technical Skills */}
                <div>
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-3">
                    <Code2 className="w-4 h-4" />
                    Skills Summary
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className={`p-3 rounded-xl border ${isDark ? 'bg-neutral-800/80 border-neutral-700' : 'bg-neutral-50 border-neutral-200'}`}>
                      <span className={`text-xs font-semibold block mb-1.5 ${
                        isDark ? 'text-white' : 'text-neutral-900'
                      }`}>
                        Languages & Frontend
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {['JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'SQL', 'React.js', 'Tailwind CSS'].map((s) => (
                          <span key={s} className="px-2 py-0.5 text-xs rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border ${isDark ? 'bg-neutral-800/80 border-neutral-700' : 'bg-neutral-50 border-neutral-200'}`}>
                      <span className={`text-xs font-semibold block mb-1.5 ${
                        isDark ? 'text-white' : 'text-neutral-900'
                      }`}>
                        Backend & Database
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {['Node.js', 'Express.js', 'REST APIs', 'JWT Authentication', 'MongoDB', 'MySQL'].map((s) => (
                          <span key={s} className="px-2 py-0.5 text-xs rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-3">
                    <Briefcase className="w-4 h-4" />
                    Work Experience (Fresher)
                  </h3>
                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-neutral-800/80 border-neutral-700' : 'bg-neutral-50 border-neutral-200'}`}>
                    <div className={`flex flex-col sm:flex-row sm:justify-between font-semibold ${
                      isDark ? 'text-white' : 'text-neutral-900'
                    }`}>
                      <span>FRONTEND DEVELOPER INTERN | (Code Alfa) | Virtual</span>
                      <span className="text-xs text-cyan-500 font-mono sm:self-center">January 25 - June 25</span>
                    </div>
                    <ul className={`mt-2.5 space-y-1.5 text-xs ${
                      isDark ? 'text-[#E2E8F0]' : 'text-neutral-600'
                    }`}>
                      <li className="flex items-start gap-1.5">
                        <span className="text-cyan-500 mt-0.5">•</span>
                        <span>Developed and optimized responsive user interfaces using React.js and Tailwind CSS, enhancing user experience. Collaborated with backend teams to integrate RESTful APIs.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-cyan-500 mt-0.5">•</span>
                        <span>Participated in agile sprints, contributing to code reviews, daily stand-ups, and project planning.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-cyan-500 mt-0.5">•</span>
                        <span>Built reusable UI components improving development efficiency by 25%.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-cyan-500 mt-0.5">•</span>
                        <span>Utilized Git and GitHub for version control and teamwork in a remote setup.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-3">
                    <Award className="w-4 h-4" />
                    Projects
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-neutral-800/80 border-neutral-700' : 'bg-neutral-50 border-neutral-200'}`}>
                      <h4 className={`font-semibold text-xs mb-1 ${
                        isDark ? 'text-white' : 'text-neutral-900'
                      }`}>
                        Studio99 Salon
                      </h4>
                      <p className={`text-xs ${
                        isDark ? 'text-[#E2E8F0]' : 'text-neutral-500'
                      }`}>
                        Designed and developed a responsive salon website using React.js and Tailwind CSS with service sections, bridal packages, and interactive UI components.
                      </p>
                    </div>
                    <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-neutral-800/80 border-neutral-700' : 'bg-neutral-50 border-neutral-200'}`}>
                      <h4 className={`font-semibold text-xs mb-1 ${
                        isDark ? 'text-white' : 'text-neutral-900'
                      }`}>
                        MegaBasket
                      </h4>
                      <p className={`text-xs ${
                        isDark ? 'text-[#E2E8F0]' : 'text-neutral-500'
                      }`}>
                        Full-stack e-commerce platform with JWT authentication, MongoDB integration, product/inventory management, cart, and modern admin dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div
              className={`px-4 sm:px-6 py-2.5 border-t text-xs flex justify-between items-center ${
                isDark ? 'border-neutral-800 bg-neutral-900/90 text-[#E2E8F0]' : 'border-neutral-200 bg-neutral-50 text-neutral-600'
              }`}
            >
              <span className="truncate mr-2">
                Document: <span className="font-mono text-cyan-500">{downloadFileName}</span>
              </span>
              <button onClick={onClose} className="hover:underline font-medium shrink-0 cursor-pointer">
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
