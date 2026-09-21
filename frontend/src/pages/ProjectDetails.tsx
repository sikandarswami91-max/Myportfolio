import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Layers,
  CheckCircle2,
  Cpu,
  Share2,
  Sparkles,
} from 'lucide-react';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/portfolioData';
import { Project, ThemeMode } from '../types';
import api from '../api/axios';
import { resolveDemoUrl } from '../utils/demoUrl';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ResumeModal } from '../components/ResumeModal';

export const ProjectDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [resumeOpen, setResumeOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'light';
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/projects/${slug}`);
        if (res.data?.success && res.data.data) {
          setProject(res.data.data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('API fetch failed, falling back to static projects:', err);
      }

      // Fallback to static catalog
      const found = DEFAULT_PROJECTS.find(
        (p) => p.slug === slug || p.id === slug || p.title.toLowerCase().replace(/\s+/g, '-') === slug
      );
      setProject(found || null);
      setLoading(false);
    };

    fetchProject();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-400">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'}`}>
        <h1 className="text-3xl font-bold mb-3">Project Not Found</h1>
        <p className="text-neutral-400 mb-6 max-w-md">The project you are looking for might have been moved, renamed, or is currently unpublished.</p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-50 text-neutral-900'}`}>
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenResume={() => setResumeOpen(true)}
        activeSection="projects"
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
        {/* Breadcrumb Back Link */}
        <button
          onClick={() => navigate('/projects')}
          className={`inline-flex items-center gap-2 mb-8 text-sm font-medium transition-colors ${
            isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all projects
        </button>

        {/* Header Title & Tags */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {project.category}
            </span>
            {project.featured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="w-3 h-3" />
                Featured Project
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading">
            {project.title}
          </h1>

          <p className={`text-base sm:text-lg max-w-3xl leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
            {project.shortDescription || project.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {resolveDemoUrl(project) && (
              <a
                href={resolveDemoUrl(project)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-md shadow-cyan-500/20 transition-all"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border font-semibold text-sm transition-all ${
                  isDark
                    ? 'border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-200'
                    : 'border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <Github className="w-4 h-4" />
                <span>Source Code</span>
              </a>
            )}
          </div>
        </div>

        {/* Project Showcase Image */}
        <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 mb-12 shadow-xl">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-auto max-h-[500px] object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Project Deep Dive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Description */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold font-heading">Overview & Architecture</h2>
            <div className={`prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              <p>{project.fullDescription || project.description}</p>
            </div>

            {/* Key Features */}
            {project.keyFeatures && project.keyFeatures.length > 0 && (
              <div className="space-y-3 pt-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  Key Features & Highlights
                </h3>
                <ul className="space-y-2">
                  {project.keyFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                      <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar Tech Stack */}
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200'}`}>
            <h3 className="text-base font-bold font-heading mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Technologies Used
            </h3>

            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${
                    isDark
                      ? 'bg-neutral-800/80 border-neutral-700/80 text-neutral-200'
                      : 'bg-neutral-100 border-neutral-200 text-neutral-800'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer theme={theme} onOpenResume={() => setResumeOpen(true)} />

      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        theme={theme}
      />
    </div>
  );
};
