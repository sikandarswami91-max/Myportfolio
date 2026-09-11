import React from 'react';
import { motion } from 'motion/react';
import {
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Star,
  Github,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export interface AdminProjectItem {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  featured: boolean;
  published: boolean;
  githubUrl?: string;
  liveUrl?: string;
  createdAt: string | Date;
}

interface ProjectCardProps {
  project: AdminProjectItem;
  onDelete: (project: AdminProjectItem) => void;
  onTogglePublish: (project: AdminProjectItem) => void;
  onToggleFeatured: (project: AdminProjectItem) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onDelete,
  onTogglePublish,
  onToggleFeatured,
}) => {
  const projectId = project._id || project.id || '';
  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="border-b border-slate-200/80 dark:border-neutral-800/80 hover:bg-neutral-800/30 transition-colors group"
    >
      {/* Project Cover & Title */}
      <td className="py-4 px-4 sm:px-6">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-10 rounded-lg bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 overflow-hidden shrink-0 relative">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 dark:text-neutral-600 font-mono">
                No Img
              </div>
            )}
            {project.featured && (
              <div className="absolute top-0.5 right-0.5 p-0.5 rounded bg-amber-500 text-neutral-950">
                <Star className="w-2.5 h-2.5 fill-current" />
              </div>
            )}
          </div>

          <div className="min-w-0 max-w-xs sm:max-w-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-white text-sm truncate font-heading group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                {project.title}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 truncate mt-0.5">
              {project.shortDescription}
            </p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="py-4 px-4 hidden md:table-cell">
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700">
          {project.category}
        </span>
      </td>

      {/* Status (Published / Draft) */}
      <td className="py-4 px-4">
        <button
          onClick={() => onTogglePublish(project)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
            project.published
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-slate-100 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-700'
          }`}
          title="Click to toggle publish status"
        >
          {project.published ? (
            <>
              <Eye className="w-3 h-3" />
              <span>Published</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3 h-3" />
              <span>Draft</span>
            </>
          )}
        </button>
      </td>

      {/* Featured Status */}
      <td className="py-4 px-4 hidden lg:table-cell">
        {project.featured ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Featured</span>
          </span>
        ) : (
          <span className="text-xs text-slate-400 dark:text-neutral-500">—</span>
        )}
      </td>

      {/* Created Date */}
      <td className="py-4 px-4 hidden sm:table-cell text-xs text-slate-500 dark:text-neutral-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
          <span>{formattedDate}</span>
        </div>
      </td>

      {/* Actions */}
      <td className="py-4 px-4 sm:px-6 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
              title="View Live"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <Link
            to={`/admin/projects/edit/${projectId}`}
            className="p-2 rounded-lg text-slate-500 dark:text-neutral-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
            title="Edit Project"
          >
            <Edit3 className="w-4 h-4" />
          </Link>

          <button
            onClick={() => onDelete(project)}
            className="p-2 rounded-lg text-slate-500 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete Project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};
