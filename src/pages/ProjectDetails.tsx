import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  CheckCircle2,
  Sparkles,
  Layers,
  Cpu,
  Database,
  Server,
  ArrowRight,
  FolderKanban,
  Check,
  Eye,
} from 'lucide-react';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/portfolioData';
import { Project, ThemeMode } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ResumeModal } from '../components/ResumeModal';
import { BackgroundEffects } from '../components/BackgroundEffects';
import api from '../api/axios';

export const ProjectDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('sikandar_theme') as ThemeMode;
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    }
    return 'dark';
  });

  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [resumeOpen, setResumeOpen] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('sikandar_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Scroll to top whenever slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Fetch project details by slug or id
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadProject = async () => {
      try {
        const res = await api.get('/api/projects');
        let projectList = DEFAULT_PROJECTS;

        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          projectList = res.data.data.map((p: any) => ({
            id: p.slug || p._id || p.id,
            title: p.title,
            category: p.category || 'Full Stack',
            description: p.description || p.shortDescription,
            longDescription: p.longDescription || p.description || p.shortDescription,
            technologies: p.technologies || [],
            image: p.image || '',
            liveUrl: p.liveUrl || 'https://demo.sikandar.dev',
            liveDemoUrl: p.liveUrl || 'https://demo.sikandar.dev',
            githubUrl: p.githubUrl || 'https://github.com/sikandar-dev',
            features: p.features || p.highlights || [
              'Full-Stack MERN Architecture with Express REST APIs',
              'Optimized MongoDB document schemas with Mongoose relations',
              'Responsive React components with responsive design',
              'JWT Token Authentication & Role-Based Access Control',
            ],
            highlights: p.highlights && p.highlights.length > 0
              ? p.highlights
              : ['High-Performance Architecture', 'Clean Code & Scalable APIs'],
            accentColor: p.accentColor || '#06B6D4',
            featured: Boolean(p.featured),
            metrics: p.metrics || 'Production Ready',
          }));
        }

        if (isMounted) {
          setAllProjects(projectList);
          const found = projectList.find(
            (p) =>
              p.id?.toLowerCase() === slug?.toLowerCase() ||
              (p as any).slug?.toLowerCase() === slug?.toLowerCase()
          );
          setProject(found || null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          const found = DEFAULT_PROJECTS.find(
            (p) => p.id?.toLowerCase() === slug?.toLowerCase()
          );
          setProject(found || null);
          setLoading(false);
        }
      }
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen relative font-sans transition-colors duration-500 selection:bg-cyan-500/25 selection:text-cyan-400 ${
        isDark ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-50 text-neutral-900'
      }`}
    >
      <BackgroundEffects theme={theme} />

      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenResume={() => setResumeOpen(true)}
        activeSection="projects"
      />

      <main className="relative z-10 pt-32 pb-24 sm:pt-36 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs & Back Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500">
              <Link to="/" className="hover:text-cyan-500 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link to="/projects" className="hover:text-cyan-500 transition-colors">
                Projects
              </Link>
              <span>/</span>
              <span className="text-neutral-800 dark:text-neutral-200 font-medium truncate max-w-[200px] sm:max-w-none">
                {project ? project.title : 'Details'}
              </span>
            </nav>

            <button
              onClick={() => navigate('/projects')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                isDark
                  ? 'border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 hover:text-white'
                  : 'border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 hover:text-black shadow-sm'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Projects</span>
            </button>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-neutral-400">Loading project details...</p>
            </div>
          ) : !project ? (
            /* Fallback state when slug is invalid */
            <div className={`p-8 sm:p-12 rounded-3xl border text-center max-w-2xl mx-auto my-12 ${
              isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200 shadow-xl'
            }`}>
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <FolderKanban className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-neutral-900 dark:text-white mb-2">
                Project Not Found
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                We could not locate any project matching "<span className="font-mono text-cyan-400">{slug}</span>". It may have been renamed or relocated.
              </p>
              <button
                onClick={() => navigate('/projects')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Explore All Projects</span>
              </button>
            </div>
          ) : (
            /* Project Details Showcase */
            <div className="space-y-12">
              {/* Hero Banner Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`p-6 sm:p-10 rounded-3xl border relative overflow-hidden ${
                  isDark
                    ? 'bg-neutral-900/80 border-neutral-800'
                    : 'bg-white border-neutral-200 shadow-lg'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <span
                    className="px-3 py-1 text-xs font-semibold rounded-full border"
                    style={{
                      backgroundColor: `${project.accentColor}18`,
                      color: project.accentColor,
                      borderColor: `${project.accentColor}40`,
                    }}
                  >
                    {project.category}
                  </span>

                  {project.featured && (
                    <span className="px-2.5 py-0.5 text-xs font-mono rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30">
                      ★ Featured Project
                    </span>
                  )}

                  {project.metrics && (
                    <span className="px-2.5 py-0.5 text-xs font-mono rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/30">
                      {project.metrics}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-neutral-900 dark:text-white tracking-tight mb-4">
                  {project.title}
                </h1>

                <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl leading-relaxed">
                  {project.longDescription || project.description}
                </p>

                {/* Primary Actions Bar */}
                <div className="flex flex-wrap items-center gap-3.5 pt-8 mt-8 border-t border-neutral-200 dark:border-neutral-800">
                  <a
                    href={project.liveDemoUrl || project.liveUrl || 'https://demo.sikandar.dev'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-all"
                  >
                    <span>Launch Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={project.githubUrl || 'https://github.com/sikandar-dev'}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-medium border transition-colors ${
                      isDark
                        ? 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white'
                        : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 shadow-sm'
                    }`}
                  >
                    <Github className="w-4 h-4" />
                    <span>View Repository</span>
                  </a>

                  <button
                    onClick={() => navigate('/contact')}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-medium border transition-colors ${
                      isDark
                        ? 'border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                        : 'border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    <span>Inquire About Similar Architecture</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>

              {/* Two-Column Grid: Architecture & Highlights */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Features & Highlights */}
                <div className="lg:col-span-8 space-y-8">
                  {/* Key Highlights */}
                  <div className={`p-6 sm:p-8 rounded-3xl border ${
                    isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200 shadow-md'
                  }`}>
                    <h3 className="text-xl font-bold font-heading text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-cyan-500" />
                      <span>Key Features & Engineering Highlights</span>
                    </h3>

                    <div className="space-y-3.5">
                      {(project.features && project.features.length > 0
                        ? project.features
                        : project.highlights
                      ).map((feat, index) => (
                        <div key={index} className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                          <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Architecture & Stack Details */}
                  <div className={`p-6 sm:p-8 rounded-3xl border ${
                    isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200 shadow-md'
                  }`}>
                    <h3 className="text-xl font-bold font-heading text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-blue-500" />
                      <span>Full-Stack Architecture</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div className={`p-4 rounded-xl border ${
                        isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                      }`}>
                        <div className="font-semibold text-neutral-900 dark:text-white mb-1.5 flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-cyan-500" />
                          <span>Frontend Stack</span>
                        </div>
                        <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                          Built with React, stateful custom hooks, Tailwind utility classes, and Framer Motion micro-interactions.
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border ${
                        isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                      }`}>
                        <div className="font-semibold text-neutral-900 dark:text-white mb-1.5 flex items-center gap-2">
                          <Server className="w-4 h-4 text-emerald-500" />
                          <span>API & Server</span>
                        </div>
                        <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                          Node.js & Express REST endpoints, modular router handlers, and strict request input sanitization.
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border ${
                        isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                      }`}>
                        <div className="font-semibold text-neutral-900 dark:text-white mb-1.5 flex items-center gap-2">
                          <Database className="w-4 h-4 text-amber-500" />
                          <span>Database & Storage</span>
                        </div>
                        <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                          MongoDB Atlas cluster with Mongoose schema modeling, compound indexes, and cloud persistence.
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border ${
                        isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                      }`}>
                        <div className="font-semibold text-neutral-900 dark:text-white mb-1.5 flex items-center gap-2">
                          <Check className="w-4 h-4 text-indigo-500" />
                          <span>Quality & Deployment</span>
                        </div>
                        <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                          ESLint verification, TypeScript type-safety across client/server, and automated cloud hosting pipelines.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Visual Mockup & Technologies */}
                <div className="lg:col-span-4 space-y-8">
                  {/* Mockup Window */}
                  <div className={`p-5 rounded-3xl border overflow-hidden ${
                    isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200 shadow-md'
                  }`}>
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                        <span className="ml-2 font-mono text-[11px] text-neutral-400 truncate max-w-[130px]">
                          app.{project.id}.demo
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-500 font-mono">● Online</span>
                    </div>

                    {project.image ? (
                      <div className="rounded-xl overflow-hidden border border-neutral-800 mb-4 max-h-48">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={`p-6 rounded-xl border text-center mb-4 ${
                        isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                      }`}>
                        <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                          style={{ backgroundColor: `${project.accentColor}20`, color: project.accentColor }}>
                          <Cpu className="w-6 h-6" />
                        </div>
                        <div className="font-heading font-bold text-sm text-neutral-900 dark:text-white mb-1">
                          {project.title}
                        </div>
                        <div className="text-[11px] text-neutral-500">Production MERN Application</div>
                      </div>
                    )}

                    <a
                      href={project.liveDemoUrl || project.liveUrl || 'https://demo.sikandar.dev'}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all"
                    >
                      <span>Open Live Application</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Technologies Badge Box */}
                  <div className={`p-6 rounded-3xl border ${
                    isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200 shadow-md'
                  }`}>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-4">
                      Technologies & Libraries
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className={`text-xs px-3 py-1.5 rounded-xl font-medium border ${
                            isDark
                              ? 'bg-neutral-800/80 border-neutral-700/60 text-neutral-300'
                              : 'bg-neutral-100 border-neutral-200 text-neutral-700'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Projects Quick Switcher */}
              <div className="pt-12 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900 dark:text-white">
                    Explore Other Projects
                  </h3>
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-500 hover:text-cyan-400 transition-colors"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allProjects
                    .filter((p) => p.id !== project.id)
                    .slice(0, 3)
                    .map((other) => (
                      <Link
                        key={other.id}
                        to={`/projects/${other.id}`}
                        className={`p-5 rounded-2xl border transition-all duration-300 group flex flex-col justify-between ${
                          isDark
                            ? 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/90'
                            : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[11px] font-mono text-cyan-500">
                              {other.category}
                            </span>
                            <span className="text-[11px] text-neutral-400 group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                              View <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                          <h4 className="text-base font-bold font-heading text-neutral-900 dark:text-white group-hover:text-cyan-500 transition-colors mb-1.5">
                            {other.title}
                          </h4>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                            {other.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer theme={theme} />

      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        theme={theme}
      />
    </div>
  );
};
