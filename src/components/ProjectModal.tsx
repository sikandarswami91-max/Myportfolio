import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Github, CheckCircle, Sparkles, Layers, Cpu, Database, Server } from 'lucide-react';
import { Project, ThemeMode } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  theme: ThemeMode;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, theme }) => {
  const isDark = theme === 'dark';

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className={`relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl z-10 overflow-hidden border ${
            isDark
              ? 'bg-neutral-900 border-neutral-800 text-neutral-100'
              : 'bg-white border-neutral-200 text-neutral-900'
          }`}
        >
          {/* Top Bar */}
          <div
            className={`flex items-center justify-between px-6 py-4 border-b ${
              isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: project.accentColor }}
              />
              <span className={`text-xs font-semibold uppercase tracking-wider ${
                isDark ? 'text-[#A8B3C2]' : 'text-neutral-500'
              }`}>
                {project.category}
              </span>
            </div>

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

          {/* Modal Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            {/* Title & Overview */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className={`text-2xl sm:text-3xl font-bold font-heading ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  {project.title}
                </h3>
                {project.metrics && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                    {project.metrics}
                  </span>
                )}
              </div>
              <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
                isDark ? 'text-[#E2E8F0]' : 'text-neutral-600'
              }`}>
                {project.longDescription}
              </p>
            </div>

            {/* Interactive Mockup Visual Window */}
            <div className={`p-5 rounded-xl border ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100/70 border-neutral-200'}`}>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  <span className={`ml-2 font-mono text-[11px] ${
                    isDark ? 'text-[#A8B3C2]' : 'text-neutral-400'
                  }`}>
                    app.{project.id}.demo
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Preview Ready
                </span>
              </div>

              {/* Mockup Screen Details */}
              <div className="space-y-3">
                <div className={`p-4 rounded-lg border ${
                  isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-neutral-200'
                }`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Key Architectural Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {project.highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-md text-xs font-medium border ${
                          isDark
                            ? 'bg-neutral-800/80 border-neutral-700/60 text-[#E2E8F0]'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                        }`}
                      >
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${
                  isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-neutral-200'
                }`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2.5">
                    Core Functionality & Deliverables
                  </h4>
                  <ul className="space-y-2">
                    {project.features.map((feat, idx) => (
                      <li key={idx} className={`flex items-start gap-2 text-xs sm:text-sm ${
                        isDark ? 'text-[#E2E8F0]' : 'text-neutral-600'
                      }`}>
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${
                isDark ? 'text-[#A8B3C2]' : 'text-neutral-500'
              }`}>
                Technology Stack Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <span
                    key={tech}
                    className={`px-3 py-1 text-xs font-medium rounded-lg border ${
                      isDark
                        ? 'bg-neutral-800/80 border-neutral-700 text-[#E2E8F0]'
                        : 'bg-neutral-100 border-neutral-200 text-neutral-800'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div
            className={`flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t ${
              isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <a
                href={project.githubUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl border transition-colors ${
                  isDark
                    ? 'border-neutral-700 hover:bg-neutral-800 text-[#E2E8F0]'
                    : 'border-neutral-300 hover:bg-neutral-100 text-neutral-700'
                }`}
              >
                <Github className="w-3.5 h-3.5" />
                Source Code
              </a>

              <a
                href={project.liveDemoUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:shadow-cyan-500/25 hover:opacity-95 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live Demo
              </a>
            </div>

            <button
              onClick={onClose}
              className={`text-xs font-medium ${
                isDark ? 'text-[#A8B3C2] hover:text-white' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Back to Portfolio
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
