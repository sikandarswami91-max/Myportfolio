import React from 'react';
import { motion } from 'motion/react';
import { Layout, Server, Database, BrainCircuit, CheckCircle2, GraduationCap, Briefcase, Sparkles } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ThemeMode } from '../types';

interface AboutProps {
  theme: ThemeMode;
}

const INFO_CARDS = [
  {
    title: 'Frontend Development',
    icon: Layout,
    description: 'Specializing in React.js, modern state architecture, responsive typography, and fluid Framer Motion animations.',
    badge: 'React & Tailwind',
    color: '#38BDF8',
  },
  {
    title: 'Backend Development',
    icon: Server,
    description: 'Architecting RESTful APIs using Node.js and Express.js with custom middleware, CORS, and JWT authentication.',
    badge: 'Node & Express',
    color: '#22C55E',
  },
  {
    title: 'Database Architecture',
    icon: Database,
    description: 'Designing NoSQL schema models with MongoDB and Mongoose, complex document indexing, and aggregation pipelines.',
    badge: 'MongoDB & Mongoose',
    color: '#10B981',
  },
  {
    title: 'Problem Solving',
    icon: BrainCircuit,
    description: 'Applying solid data structure fundamentals, algorithmic optimization, and systematic debugging practices.',
    badge: 'DSA & Clean Code',
    color: '#A855F7',
  },
];

export const About: React.FC<AboutProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <section id="about" className="py-24 sm:py-32 relative">
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
            <span>Profile & Background</span>
          </div>
          <h2 className={`text-3xl sm:text-5xl font-extrabold font-heading tracking-tight ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            About Me
          </h2>
          <p className={`mt-4 text-base sm:text-lg ${
            isDark ? 'text-[#E2E8F0]' : 'text-neutral-600'
          }`}>
            Passionate MERN Stack Developer transforming complex concepts into clean, high-performance web applications.
          </p>
        </motion.div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Narrative Bio & Highlights */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className={`max-w-none text-base leading-relaxed space-y-4 ${
              isDark ? 'text-[#E2E8F0]' : 'text-neutral-600'
            }`}>
              <p>
                Hello! I’m <span className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>Sikandar</span>, a dedicated{' '}
                <span className="text-cyan-500 dark:text-cyan-400 font-semibold">MERN Stack Developer</span> currently pursuing my{' '}
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>Bachelor of Computer Applications (BCA)</span>, Semester VI (Session 2025–26).
              </p>

              <p>
                My passion lies in architecting full-stack web solutions where design elegance meets scalable backend engineering. With hands-on expertise spanning <span className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>React.js, Node.js, Express.js, and MongoDB</span>, I enjoy building everything from interactive AI-driven assistants to robust enterprise portals and consumer e-commerce storefronts.
              </p>

              <p>
                During my <span className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>6-month tenure at V MART</span>, I gained valuable frontline exposure to digital retail operations and inventory workflows, strengthening my discipline for writing clean code, preventing edge-case bugs, and delivering reliable software under real-world requirements.
              </p>
            </div>

            {/* Quick Education & Experience Badges */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
                  isDark
                    ? 'bg-neutral-900/80 border-neutral-800'
                    : 'bg-white border-neutral-200 shadow-sm'
                }`}
              >
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-xs font-semibold ${isDark ? 'text-[#A8B3C2]' : 'text-neutral-500'}`}>
                    BCA Undergrad
                  </div>
                  <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    Semester VI (2025–26)
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
                  isDark
                    ? 'bg-neutral-900/80 border-neutral-800'
                    : 'bg-white border-neutral-200 shadow-sm'
                }`}
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-xs font-semibold ${isDark ? 'text-[#A8B3C2]' : 'text-neutral-500'}`}>
                    Enterprise Exposure
                  </div>
                  <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    V MART (6 Months)
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 4 Key Capability Information Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {INFO_CARDS.map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.12, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className={`p-5 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${
                    isDark
                      ? 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)]'
                      : 'bg-white border-neutral-200/90 hover:border-neutral-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]'
                  }`}
                >
                  {/* Subtle hover accent line on top */}
                  <div
                    className="absolute top-0 inset-x-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: card.color }}
                  />

                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${card.color}18`,
                        color: card.color,
                      }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      isDark
                        ? 'border-neutral-700 text-[#E2E8F0] bg-neutral-800/60'
                        : 'border-neutral-200 text-neutral-600 bg-neutral-50'
                    }`}>
                      {card.badge}
                    </span>
                  </div>

                  <h3 className={`text-base font-bold font-heading mb-2 ${
                    isDark ? 'text-white' : 'text-neutral-900'
                  }`}>
                    {card.title}
                  </h3>

                  <p className={`text-xs sm:text-sm leading-relaxed ${
                    isDark ? 'text-[#E2E8F0]' : 'text-neutral-600'
                  }`}>
                    {card.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
