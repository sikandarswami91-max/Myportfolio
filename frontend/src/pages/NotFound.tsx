import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        <span className="text-8xl sm:text-9xl font-extrabold text-neutral-800 tracking-widest font-heading">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl sm:text-2xl font-bold text-cyan-400 bg-neutral-950 px-4 py-1 rounded-full border border-cyan-500/30">
            Page Not Found
          </span>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold mb-3">Looking for something?</h1>
      <p className="text-neutral-400 max-w-md text-sm sm:text-base mb-8">
        The page or resource you requested does not exist or has been relocated.
      </p>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};
