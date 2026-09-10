import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ExternalLink, Github, Sparkles, Eye, Check, ArrowRight } from 'lucide-react';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/portfolioData';
import { Project, ThemeMode } from '../types';
import api from '../api/axios';

interface ProjectsProps {
  theme: ThemeMode;
  onSelectProject: (project: Project) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ theme, onSelectProject }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [projectsList, setProjectsList] = useState<Project[]>(DEFAULT_PROJECTS);

  useEffect(() => {
    const fetchPublishedProjects = async () => {
      try {
        const res = await api.get('/api/projects');
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          // Adapt backend project format to public Project type
          const adapted: Project[] = res.data.data.map((p: any) => ({
            id: p.slug || p._id || p.id,
            title: p.title,
            category: p.category || 'Full Stack',
            description: p.description || p.shortDescription,
            technologies: p.technologies || [],
            image: p.image || '',
            liveUrl: p.liveUrl || 'https://demo.sikandar.dev',
            githubUrl: p.githubUrl || 'https://github.com/sikandarswami91-max',
            highlights: p.highlights && p.highlights.length > 0
              ? p.highlights
              : [
                  `Full-Stack MERN Architecture with Express REST APIs`,
                  `Optimized performance with responsive client components`,
                ],
            accentColor: p.accentColor || '#06B6D4',
            featured: Boolean(p.featured),
          }));
          setProjectsList(adapted);
        }
      } catch (err) {
        // Fallback gracefully to default seeded portfolio projects
        console.warn('Using seeded portfolio projects data fallback');
      }
    };

    fetchPublishedProjects();
  }, []);

  return (
    <section id="projects" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portfolio Highlights</span>
          </div>
          <h2 className={`text-3xl sm:text-5xl font-extrabold font-heading tracking-tight ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            Featured Projects
          </h2>
          <p className={`mt-4 text-base sm:text-lg ${
            isDark ? 'text-[#E2E8F0]' : 'text-neutral-600'
          }`}>
            Engineered with the MERN stack: high-availability backends, responsive client architecture, and polished UI/UX.
          </p>
        </motion.div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {projectsList.map((project, index) => {
            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                whileHover={{ y: -6 }}
                className={`group rounded-3xl border overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                  isDark
                    ? 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)]'
                    : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)]'
                }`}
              >
                {/* Visual Header / Mockup Preview Area */}
                <div
                  onClick={() => onSelectProject(project)}
                  className="cursor-pointer relative h-60 sm:h-72 w-full overflow-hidden border-b border-neutral-200 dark:border-neutral-800 bg-neutral-950 flex flex-col justify-between p-5 select-none"
                  style={{
                    background: isDark
                      ? `linear-gradient(135deg, #090d16 0%, #111827 50%, #0f172a 100%)`
                      : `linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)`,
                  }}
                >
                  {/* Subtle decorative grid */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                  {/* Window Bar */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className={`ml-2 text-[11px] font-mono truncate max-w-[150px] ${
                        isDark ? 'text-[#A8B3C2]' : 'text-neutral-500'
                      }`}>
                        {project.id}.sikandar.dev
                      </span>
                    </div>

                    <span
                      className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full border backdrop-blur-md"
                      style={{
                        backgroundColor: `${project.accentColor}18`,
                        color: project.accentColor,
                        borderColor: `${project.accentColor}40`,
                      }}
                    >
                      {project.category}
                    </span>
                  </div>

                  {/* Project preview illustration or image */}
                  <div className="relative z-10 flex flex-col items-center justify-center my-auto transition-transform duration-500 group-hover:scale-105">
                    {project.image ? (
                      <div className="w-full max-w-sm rounded-xl overflow-hidden border border-neutral-800 shadow-xl max-h-36">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-full max-w-sm rounded-xl p-4 border backdrop-blur-md shadow-xl transition-colors ${
                          isDark
                            ? 'bg-neutral-900/80 border-neutral-700/60'
                            : 'bg-white/90 border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-200 dark:border-neutral-800">
                          <span className={`text-xs font-bold font-heading ${
                            isDark ? 'text-white' : 'text-neutral-900'
                          }`}>
                            {project.title}
                          </span>
                          <span className="text-[10px] text-emerald-500 font-mono">
                            ● Online
                          </span>
                        </div>

                        <div className={`space-y-1.5 text-[11px] ${
                          isDark ? 'text-[#E2E8F0]' : 'text-neutral-600'
                        }`}>
                          {project.highlights.slice(0, 2).map((h, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                              <span className="truncate">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Preview Overlay on Hover */}
                  <div
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className={`relative z-10 flex items-center justify-between text-xs cursor-pointer ${
                      isDark ? 'text-[#A8B3C2]' : 'text-neutral-500'
                    }`}
                  >
                    <span className="font-mono text-[11px]">Production MERN Stack</span>
                    <span className="inline-flex items-center gap-1 text-cyan-500 font-semibold group-hover:translate-x-1 transition-transform">
                      <Eye className="w-3.5 h-3.5" />
                      View Project Details
                    </span>
                  </div>
                </div>

                {/* Content Details Area */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2.5">
                      <h3
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className={`cursor-pointer text-xl sm:text-2xl font-bold font-heading group-hover:text-cyan-400 transition-colors ${
                          isDark ? 'text-white' : 'text-neutral-900'
                        }`}
                      >
                        {project.title}
                      </h3>
                      {project.featured && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 whitespace-nowrap">
                          ★ Featured
                        </span>
                      )}
                    </div>

                    <p className={`text-sm leading-relaxed mb-5 line-clamp-3 ${
                      isDark ? 'text-[#E2E8F0]' : 'text-neutral-600'
                    }`}>
                      {project.description}
                    </p>
                  </div>

                  <div>
                    {/* Technology Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium border ${
                            isDark
                              ? 'bg-neutral-800/80 border-neutral-700/80 text-[#E2E8F0]'
                              : 'bg-neutral-100 border-neutral-200 text-neutral-700'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className={`flex flex-wrap items-center gap-2.5 pt-4 border-t ${
                      isDark ? 'border-neutral-800' : 'border-neutral-200'
                    }`}>
                      <Link
                        to={`/projects/${project.id}`}
                        className="flex-1 min-w-[110px] inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:shadow-cyan-500/25 hover:opacity-95 transition-all text-center"
                      >
                        <span>Project Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <a
                        href={(project as any).liveDemoUrl || project.liveUrl || 'https://demo.sikandar.dev'}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium border transition-colors ${
                          isDark
                            ? 'border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-[#E2E8F0] hover:text-white'
                            : 'border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 hover:text-black shadow-sm'
                        }`}
                        title="Open Live Demo in new tab"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <a
                        href={project.githubUrl || 'https://github.com/sikandarswami91-max'}
                        target="_blank"
                        rel="noreferrer"
                        className={`p-2.5 rounded-xl border transition-colors ${
                          isDark
                            ? 'border-neutral-700 hover:bg-neutral-800 text-[#E2E8F0] hover:text-white'
                            : 'border-neutral-300 hover:bg-neutral-100 text-neutral-700 hover:text-black shadow-sm'
                        }`}
                        title="GitHub Repository"
                        aria-label="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
