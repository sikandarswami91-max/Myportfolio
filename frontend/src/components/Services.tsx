import React from 'react';
import { motion } from 'motion/react';
import { Globe, Layout, Layers, Smartphone, Check, Sparkles, ArrowRight } from 'lucide-react';
import { SERVICES } from '../data/portfolioData';
import { ThemeMode } from '../types';

interface ServicesProps {
  theme: ThemeMode;
  onContactClick: () => void;
}

const SERVICE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Globe: Globe,
  Layout: Layout,
  Layers: Layers,
  Smartphone: Smartphone,
};

export const Services: React.FC<ServicesProps> = ({ theme, onContactClick }) => {
  const isDark = theme === 'dark';

  return (
    <section id="services" className="py-24 sm:py-32 relative">
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
            <span>Core Offerings</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-neutral-900 dark:text-white tracking-tight">
            What I Can Do
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-300">
            Delivering high-end digital solutions, from responsive client interfaces to secure end-to-end full stack web platforms.
          </p>
        </motion.div>

        {/* 4 Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {SERVICES.map((service, idx) => {
            const IconComp = SERVICE_ICONS[service.icon] || Globe;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                whileHover={{ y: -6 }}
                className={`p-7 sm:p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between relative group ${
                  isDark
                    ? 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)]'
                    : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)]'
                }`}
              >
                <div>
                  {/* Top Bar: Icon + Tagline */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 flex items-center justify-center transition-transform group-hover:scale-105">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400">
                      {service.tagline}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-neutral-900 dark:text-white mb-2.5">
                    {service.title}
                  </h3>

                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Deliverables */}
                  <div className="space-y-2 pt-4 border-t border-neutral-200 dark:border-neutral-800 mb-6">
                    {service.deliverables.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onContactClick}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-500 hover:text-cyan-400 transition-colors self-start group-hover:translate-x-1"
                >
                  <span>Discuss a Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
