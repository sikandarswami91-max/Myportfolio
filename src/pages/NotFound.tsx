import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, ArrowLeft, Sparkles, Compass } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center relative z-10 p-8 rounded-3xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-xl shadow-2xl"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium mb-3 bg-red-500/10 text-red-400 border border-red-500/20">
          <span>Error 404</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight mb-3">
          Page Not Found
        </h1>

        <p className="text-sm text-neutral-300 mb-8 leading-relaxed">
          The route or page you are looking for does not exist or has been moved. Use the navigation buttons below to return safely.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-900/30 hover:shadow-cyan-900/50 hover:scale-[1.02] transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            to="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-medium border border-neutral-700 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Projects</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
