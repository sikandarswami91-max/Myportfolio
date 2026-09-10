import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Code,
  Layout,
  Palette,
  Server,
  Cpu,
  Database,
  GitBranch,
  Github,
  Sparkles,
  Layers,
  Atom,
} from 'lucide-react';
import { SKILLS } from '../data/portfolioData';
import { Skill, ThemeMode } from '../types';

interface SkillsProps {
  theme: ThemeMode;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Atom: Atom,
  Server: Server,
  Cpu: Cpu,
  Database: Database,
  Code: Code,
  Layout: Layout,
  Palette: Palette,
  GitBranch: GitBranch,
  Github: Github,
};

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Database', 'Tools'] as const;

export const Skills: React.FC<SkillsProps> = ({ theme }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const isDark = theme === 'dark';

  const filteredSkills =
    activeCategory === 'All'
      ? SKILLS
      : SKILLS.filter((s) => s.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section id="skills" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Technical Arsenal</span>
          </div>
          <h2 className={`text-3xl sm:text-5xl font-extrabold font-heading tracking-tight ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            My Skills
          </h2>
          <p className={`mt-4 text-base sm:text-lg ${
            isDark ? 'text-[#E2E8F0]' : 'text-neutral-600'
          }`}>
            Engineered with modern industry standards, clean code architecture, and high-performance practices.
          </p>
        </motion.div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : isDark
                  ? 'bg-neutral-900/80 text-[#E2E8F0] hover:text-white border border-neutral-700/80'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 border border-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Animated Skill Cards Grid */}
        <motion.div
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredSkills.map((skill) => {
            const IconComp = ICON_MAP[skill.icon] || Code;
            return (
              <motion.div
                key={skill.name}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className={`relative group rounded-2xl p-6 border transition-all duration-300 ${
                  isDark
                    ? 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)]'
                    : 'bg-white border-neutral-200/90 hover:border-neutral-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)]'
                }`}
              >
                {/* Glow ring on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -m-[1px]"
                  style={{
                    boxShadow: `0 0 28px ${skill.color}25`,
                    border: `1px solid ${skill.color}40`,
                  }}
                />

                <div className="relative z-10 flex items-start justify-between mb-4">
                  {/* Icon Box */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
                    style={{
                      backgroundColor: `${skill.color}15`,
                      color: skill.color,
                      border: `1px solid ${skill.color}30`,
                    }}
                  >
                    <IconComp className="w-6 h-6" />
                  </div>

                  {/* Proficiency Indicator */}
                  <span
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-full border"
                    style={{
                      backgroundColor: `${skill.color}10`,
                      color: skill.color,
                      borderColor: `${skill.color}30`,
                    }}
                  >
                    {skill.proficiency}
                  </span>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className={`text-lg font-bold font-heading ${
                      isDark ? 'text-white' : 'text-neutral-900'
                    }`}>
                      {skill.name}
                    </h3>
                    <span className={`text-xs font-mono ${
                      isDark ? 'text-[#A8B3C2]' : 'text-neutral-500'
                    }`}>
                      {skill.category}
                    </span>
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed ${
                    isDark ? 'text-[#E2E8F0]' : 'text-neutral-600'
                  }`}>
                    {skill.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
