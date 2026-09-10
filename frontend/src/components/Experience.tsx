import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Calendar, MapPin, CheckCircle2, Sparkles, Building2 } from 'lucide-react';
import { EXPERIENCE } from '../data/portfolioData';
import { ThemeMode } from '../types';

interface ExperienceProps {
  theme: ThemeMode;
}

export const Experience: React.FC<ExperienceProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <section id="experience" className="py-24 sm:py-32 relative">
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
            <span>Career Milestones</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-neutral-900 dark:text-white tracking-tight">
            Experience
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-300">
            Real-world enterprise exposure to software reliability, inventory tracking, and operational efficiency.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="max-w-3xl mx-auto relative">
          {/* Vertical Timeline Track Line */}
          <div className="absolute top-0 bottom-0 left-4 sm:left-8 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-transparent" />

          {EXPERIENCE.map((exp, idx) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="relative pl-12 sm:pl-20 pb-12 last:pb-0"
            >
              {/* Timeline Pin Indicator */}
              <div className="absolute left-2.5 sm:left-6.5 top-1 -translate-x-1/2 w-5 h-5 rounded-full bg-neutral-950 dark:bg-neutral-900 border-2 border-cyan-500 flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.5)]">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>

              {/* Experience Card */}
              <motion.div
                whileHover={{ y: -4 }}
                className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
                  isDark
                    ? 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700 shadow-xl'
                    : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-cyan-500" />
                      <h3 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900 dark:text-white">
                        {exp.company}
                      </h3>
                    </div>
                    <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 mt-1">
                      {exp.role}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.duration}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                  {exp.description}
                </p>

                {/* Key Responsibilities */}
                <div className="space-y-2.5 mb-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Key Contributions & Responsibilities
                  </div>
                  {exp.responsibilities.map((resp, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>

                {/* Skills used */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Applied Competencies
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium border ${
                          isDark
                            ? 'bg-neutral-800/60 border-neutral-700/60 text-neutral-300'
                            : 'bg-neutral-100 border-neutral-200 text-neutral-700'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
