import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Calendar, CheckCircle2, Sparkles, BookOpen, Award } from 'lucide-react';
import { EDUCATION } from '../data/portfolioData';
import { ThemeMode } from '../types';

interface EducationProps {
  theme: ThemeMode;
}

export const Education: React.FC<EducationProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <section id="education" className="py-24 sm:py-32 relative">
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
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-neutral-900 dark:text-white tracking-tight">
            Education
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-300">
            Solid foundations in computer science, software engineering principles, and full-stack development.
          </p>
        </motion.div>

        {/* Education Card */}
        <div className="max-w-3xl mx-auto">
          {EDUCATION.map((edu, idx) => (
            <motion.div
              key={edu.degree}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -4 }}
              className={`p-6 sm:p-10 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
                isDark
                  ? 'bg-neutral-900/80 border-neutral-800/90 hover:border-neutral-700 shadow-2xl'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-lg shadow-neutral-200/50'
              }`}
            >
              {/* Subtle top accent gradient */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-blue-600" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900 dark:text-white">
                      {edu.degree}
                    </h3>
                    <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 mt-0.5">
                      {edu.status}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-mono self-start sm:self-auto">
                  <Calendar className="w-3.5 h-3.5" />
                  {edu.duration}
                </div>
              </div>

              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                {edu.description}
              </p>

              {/* Highlights */}
              <div className="space-y-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-300 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Key Coursework & Academic Focus
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(edu.highlights ?? []).map((item, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-200 ${
                        isDark ? 'bg-neutral-800/60 border-neutral-700/80' : 'bg-neutral-50 border-neutral-200'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
