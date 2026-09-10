import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Download, Github, Terminal, Sparkles, CheckCircle2, Code, Database, Server, Cpu } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ThemeMode } from '../types';
import { downloadResumeFile } from '../utils/downloadResume';

interface HeroProps {
  theme: ThemeMode;
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ theme, onOpenResume }) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const scrollToProjects = () => {
    navigate('/projects', { replace: false });
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen pt-32 pb-20 sm:pt-40 sm:pb-28 flex items-center justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-start text-left z-10"
          >
            {/* Status Pill */}
            <motion.div
              variants={itemVariants}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-6 text-xs font-medium backdrop-blur-md shadow-sm transition-colors ${
                isDark
                  ? 'border-neutral-700 bg-neutral-900/80 text-[#E2E8F0]'
                  : 'border-neutral-200/80 bg-neutral-100/70 text-neutral-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for MERN Developer Roles & Internships</span>
            </motion.div>

            {/* Greeting */}
            <motion.p
              variants={itemVariants}
              className={`text-lg sm:text-xl font-semibold mb-2 tracking-wide ${
                isDark ? 'text-cyan-400' : 'text-cyan-600'
              }`}
            >
              Hi, I'm Sikandar
            </motion.p>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className={`text-4xl sm:text-6xl xl:text-7xl font-extrabold font-heading tracking-tight leading-[1.08] mb-6 ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}
            >
              MERN Stack{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
                Developer
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className={`text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed mb-8 ${
                isDark ? 'text-[#E2E8F0]' : 'text-neutral-600'
              }`}
            >
              {PERSONAL_INFO.tagline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <motion.button
                id="hero-view-projects-btn"
                onClick={scrollToProjects}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.a
                id="hero-download-resume-btn"
                href="/api/resume/download"
                download="Sikandar_Swami_Resume.pdf"
                onClick={(e) => {
                  e.preventDefault();
                  downloadResumeFile('Sikandar_Swami_Resume.pdf', '/api/resume/download');
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border transition-all cursor-pointer ${
                  isDark
                    ? 'border-neutral-700 bg-neutral-900/80 text-[#E2E8F0] hover:bg-neutral-800 hover:border-neutral-600'
                    : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-neutral-400 shadow-sm'
                }`}
              >
                <Download className="w-4 h-4 text-cyan-500" />
                <span>Download Resume</span>
              </motion.a>

              <motion.a
                id="hero-github-btn"
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm border transition-all cursor-pointer ${
                  isDark
                    ? 'border-neutral-700 bg-neutral-900/80 text-[#E2E8F0] hover:bg-neutral-800 hover:text-white hover:border-neutral-600'
                    : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 hover:text-black hover:border-neutral-400 shadow-sm'
                }`}
                title="GitHub Profile (sikandarswami91-max)"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4 text-cyan-500" />
                <span>GitHub</span>
              </motion.a>
            </motion.div>

            {/* Quick Metrics Strip */}
            <motion.div
              variants={itemVariants}
              className={`mt-12 pt-8 border-t grid grid-cols-3 gap-6 sm:gap-10 ${
                isDark ? 'border-neutral-800' : 'border-neutral-200'
              }`}
            >
              <div>
                <div className={`text-2xl sm:text-3xl font-bold font-heading ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  6+ <span className="text-cyan-500 text-lg sm:text-xl font-sans">Mo</span>
                </div>
                <div className={`text-xs mt-0.5 ${
                  isDark ? 'text-[#A8B3C2]' : 'text-neutral-500'
                }`}>
                  V MART Experience
                </div>
              </div>
              <div>
                <div className={`text-2xl sm:text-3xl font-bold font-heading ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  10+ <span className="text-blue-500 text-lg sm:text-xl font-sans">Apps</span>
                </div>
                <div className={`text-xs mt-0.5 font-medium ${
                  isDark ? 'text-[#E2E8F0]' : 'text-neutral-500'
                }`}>
                  Full-Stack Builds
                </div>
              </div>
              <div>
                <div className={`text-2xl sm:text-3xl font-bold font-heading ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  BCA <span className="text-indigo-500 text-xs sm:text-sm font-mono">2026</span>
                </div>
                <div className={`text-xs mt-0.5 font-medium ${
                  isDark ? 'text-[#E2E8F0]' : 'text-neutral-500'
                }`}>
                  Semester VI Scholar
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Developer Visual & Floating Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative flex items-center justify-center mt-6 lg:mt-0"
          >
            {/* Ambient Radial Backdrop Glow */}
            <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-500/15 to-indigo-500/20 blur-3xl opacity-70 pointer-events-none" />

            {/* Central Glassmorphic Developer Code / Profile Card */}
            <div
              className={`relative w-full max-w-md rounded-2xl p-5 sm:p-6 backdrop-blur-xl border shadow-2xl transition-all duration-300 ${
                isDark
                  ? 'bg-neutral-900/80 border-neutral-800/90 shadow-cyan-950/20'
                  : 'bg-white/90 border-neutral-200/90 shadow-neutral-300/40'
              }`}
            >
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-neutral-500 dark:text-neutral-300">
                    sikandar.dev.tsx
                  </span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                  MERN Architect
                </span>
              </div>

              {/* Code Snippet Display */}
              <div className="font-mono text-xs leading-relaxed space-y-1.5 overflow-hidden">
                <div className={isDark ? 'text-[#A8B3C2]' : 'text-neutral-500'}>
                  // Candidate Profile & Technical Stack
                </div>
                <div>
                  <span className="text-purple-600 dark:text-purple-400">const</span>{' '}
                  <span className="text-blue-600 dark:text-blue-400">developer</span> = {'{'}
                </div>
                <div className="pl-4">
                  <span className={isDark ? 'text-[#E2E8F0]' : 'text-neutral-700'}>name:</span>{' '}
                  <span className="text-emerald-600 dark:text-emerald-400">'Sikandar'</span>,
                </div>
                <div className="pl-4">
                  <span className={isDark ? 'text-[#E2E8F0]' : 'text-neutral-700'}>role:</span>{' '}
                  <span className="text-emerald-600 dark:text-emerald-400">'MERN Stack Developer'</span>,
                </div>
                <div className="pl-4">
                  <span className={isDark ? 'text-[#E2E8F0]' : 'text-neutral-700'}>education:</span>{' '}
                  <span className="text-emerald-600 dark:text-emerald-400">'BCA Semester VI (2025-26)'</span>,
                </div>
                <div className="pl-4">
                  <span className={isDark ? 'text-[#E2E8F0]' : 'text-neutral-700'}>stack:</span> [
                  <span className="text-amber-600 dark:text-amber-400">'MongoDB'</span>,{' '}
                  <span className="text-amber-600 dark:text-amber-400">'Express'</span>,{' '}
                  <span className="text-amber-600 dark:text-amber-400">'React'</span>,{' '}
                  <span className="text-amber-600 dark:text-amber-400">'Node.js'</span>],
                </div>
                <div className="pl-4">
                  <span className={isDark ? 'text-[#E2E8F0]' : 'text-neutral-700'}>passionate:</span>{' '}
                  <span className="text-cyan-600 dark:text-cyan-400">true</span>,
                </div>
                <div className={isDark ? 'text-white' : 'text-neutral-900'}>{'}'};</div>

                <div className={`pt-2 flex items-center gap-1.5 ${isDark ? 'text-cyan-300' : 'text-cyan-600'}`}>
                  <span className="animate-pulse">▶</span>
                  <span className="text-[11px]">Ready to build production-grade web systems.</span>
                </div>
              </div>

              {/* Developer Profile Badge bar */}
              <div className={`mt-5 pt-4 border-t flex items-center justify-between ${
                isDark ? 'border-neutral-800' : 'border-neutral-200'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    S
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      Sikandar
                    </div>
                    <div className={`text-[10px] ${isDark ? 'text-[#A8B3C2]' : 'text-neutral-500'}`}>
                      BCA Web Engineer
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>
            </div>

            {/* Floating Technology Badges with Framer Motion float animations */}
            {/* React.js Badge */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 2, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-6 -right-4 sm:-right-6 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md shadow-lg border border-cyan-500/30 bg-white/90 dark:bg-neutral-900/90 text-cyan-500 flex items-center gap-1.5"
            >
              <Code className="w-3.5 h-3.5" />
              <span>React.js</span>
            </motion.div>

            {/* Node.js Badge */}
            <motion.div
              animate={{
                y: [0, 12, 0],
                rotate: [0, -2, 0],
              }}
              transition={{
                duration: 5.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
              className="absolute -bottom-5 -left-4 sm:-left-6 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md shadow-lg border border-emerald-500/30 bg-white/90 dark:bg-neutral-900/90 text-emerald-500 flex items-center gap-1.5"
            >
              <Server className="w-3.5 h-3.5" />
              <span>Node.js</span>
            </motion.div>

            {/* MongoDB Badge */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                x: [0, 4, 0],
              }}
              transition={{
                duration: 4.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute -bottom-6 -right-2 sm:right-4 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md shadow-lg border border-emerald-500/30 bg-white/90 dark:bg-neutral-900/90 text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              <span>MongoDB</span>
            </motion.div>

            {/* Express.js Badge */}
            <motion.div
              animate={{
                y: [0, 9, 0],
                x: [0, -5, 0],
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.5,
              }}
              className="absolute -top-6 -left-2 sm:left-4 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md shadow-lg border border-purple-500/30 bg-white/90 dark:bg-neutral-900/90 text-purple-600 dark:text-purple-400 flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Express.js</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
