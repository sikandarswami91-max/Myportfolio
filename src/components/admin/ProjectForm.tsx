import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  UploadCloud,
  Image as ImageIcon,
  Plus,
  X,
  ExternalLink,
  Github,
  Globe,
  Tag,
  Save,
  Check,
  AlertCircle,
} from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

export interface ProjectFormData {
  _id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  category: string;
  featured: boolean;
  published: boolean;
  accentColor?: string;
}

interface ProjectFormProps {
  initialData?: ProjectFormData;
  isEditing?: boolean;
}

const CATEGORIES = [
  'Full Stack',
  'Frontend',
  'Backend',
  'AI & Full Stack',
  'Healthcare',
  'Modern Web',
  'E-Commerce',
];

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  isEditing = false,
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<ProjectFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    shortDescription: initialData?.shortDescription || '',
    description: initialData?.description || '',
    image: initialData?.image || '',
    technologies: initialData?.technologies || ['React', 'Node.js', 'Express', 'MongoDB'],
    githubUrl: initialData?.githubUrl || '',
    liveUrl: initialData?.liveUrl || '',
    category: initialData?.category || 'Full Stack',
    featured: initialData?.featured ?? false,
    published: initialData?.published ?? true,
    accentColor: initialData?.accentColor || '#06B6D4',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.image || '');
  const [newTech, setNewTech] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate slug from title if not manually touched
  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const updates: any = { title: val };
      if (!isEditing || !prev.slug) {
        updates.slug = val
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-');
      }
      return { ...prev, ...updates };
    });
    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPG, PNG, WEBP, SVG)', 'error');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        showToast('Image file size must be less than 10MB', 'error');
        return;
      }
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const addTechTag = () => {
    const trimmed = newTech.trim();
    if (!trimmed) return;
    if (formData.technologies.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      showToast('Technology tag already added', 'info');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      technologies: [...prev.technologies, trimmed],
    }));
    setNewTech('');
  };

  const removeTechTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tagToRemove),
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!formData.description.trim()) newErrors.description = 'Full description is required';
    if (formData.technologies.length === 0) newErrors.technologies = 'Please add at least one technology tag';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Build form data to support file upload
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('slug', formData.slug);
      payload.append('shortDescription', formData.shortDescription);
      payload.append('description', formData.description);
      payload.append('technologies', JSON.stringify(formData.technologies));
      payload.append('githubUrl', formData.githubUrl);
      payload.append('liveUrl', formData.liveUrl);
      payload.append('category', formData.category);
      payload.append('featured', String(formData.featured));
      payload.append('published', String(formData.published));
      payload.append('accentColor', formData.accentColor || '#06B6D4');

      if (selectedFile) {
        payload.append('image', selectedFile);
      } else if (formData.image) {
        payload.append('imageUrl', formData.image);
      }

      if (isEditing && initialData?._id) {
        await api.put(`/api/admin/projects/${initialData._id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Project updated successfully!', 'success');
      } else {
        await api.post('/api/admin/projects', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Project created successfully!', 'success');
      }

      navigate('/admin/projects');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to save project';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Core Fields */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title & Slug */}
          <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-white font-heading">
              General Information
            </h3>

            {/* Project Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Virtual AI Assistant"
                className={`w-full px-4 py-3 text-sm rounded-xl border bg-neutral-950 text-white transition-all focus:outline-none focus:ring-2 ${
                  errors.title
                    ? 'border-rose-500 focus:ring-rose-500/30'
                    : 'border-neutral-800 focus:border-cyan-500 focus:ring-cyan-500/30'
                }`}
              />
              {errors.title && <p className="mt-1 text-xs text-rose-400">{errors.title}</p>}
            </div>

            {/* Project Slug */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                URL Slug (Auto-generated) *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. virtual-ai-assistant"
                className="w-full px-4 py-3 text-sm font-mono rounded-xl border border-neutral-800 bg-neutral-950 text-cyan-400 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Short Description (Card Summary) *
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => {
                  setFormData({ ...formData, shortDescription: e.target.value });
                  if (errors.shortDescription) setErrors({ ...errors, shortDescription: '' });
                }}
                placeholder="Brief one-line summary for project cards"
                className={`w-full px-4 py-3 text-sm rounded-xl border bg-neutral-950 text-white focus:outline-none focus:ring-2 ${
                  errors.shortDescription
                    ? 'border-rose-500 focus:ring-rose-500/30'
                    : 'border-neutral-800 focus:border-cyan-500 focus:ring-cyan-500/30'
                }`}
              />
              {errors.shortDescription && (
                <p className="mt-1 text-xs text-rose-400">{errors.shortDescription}</p>
              )}
            </div>

            {/* Full Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Full Description (Project Details & Architecture) *
              </label>
              <textarea
                rows={6}
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description) setErrors({ ...errors, description: '' });
                }}
                placeholder="Detailed explanation of technical implementation, challenges solved, architecture, and features..."
                className={`w-full px-4 py-3 text-sm rounded-xl border bg-neutral-950 text-white focus:outline-none focus:ring-2 resize-y ${
                  errors.description
                    ? 'border-rose-500 focus:ring-rose-500/30'
                    : 'border-neutral-800 focus:border-cyan-500 focus:ring-cyan-500/30'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-rose-400">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Technologies Tag Manager */}
          <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-heading">
                Technologies Stack *
              </h3>
              <span className="text-xs text-neutral-400">
                {formData.technologies.length} tags added
              </span>
            </div>

            {/* Active Tags */}
            <div className="flex flex-wrap gap-2 min-h-[44px] p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
              {formData.technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 text-xs font-mono font-medium text-cyan-300 border border-neutral-700 shadow-sm"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => removeTechTag(tech)}
                    className="p-0.5 rounded hover:bg-neutral-700 text-neutral-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}

              {formData.technologies.length === 0 && (
                <span className="text-xs text-neutral-500 italic py-1">
                  No technologies specified yet. Add tags below.
                </span>
              )}
            </div>
            {errors.technologies && (
              <p className="text-xs text-rose-400">{errors.technologies}</p>
            )}

            {/* Add Tag Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTechTag();
                  }
                }}
                placeholder="e.g. React.js, Node.js, Tailwind CSS"
                className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={addTechTag}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Tag</span>
              </button>
            </div>
          </div>

          {/* Links & Repository */}
          <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h3 className="text-base font-bold text-white font-heading">
              Project Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  GitHub Repository URL
                </label>
                <div className="relative">
                  <Github className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/sikandar-dev/..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Live Demo URL
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://demo.sikandar.dev"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Image Upload & Visibility Settings */}
        <div className="lg:col-span-4 space-y-6">
          {/* Project Image Upload / Cloudinary */}
          <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h3 className="text-base font-bold text-white font-heading">
              Project Cover Image
            </h3>

            {/* Preview Box */}
            <div className="w-full aspect-video rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden relative group flex items-center justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                  <span className="text-xs text-neutral-500">No image uploaded</span>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div>
              <label className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 text-sm font-semibold cursor-pointer transition-colors">
                <UploadCloud className="w-4 h-4" />
                <span>{previewUrl ? 'Replace Image' : 'Upload Cover Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="mt-1.5 text-[11px] text-neutral-500 text-center">
                Supports JPG, PNG, WEBP, SVG up to 10MB (Cloudinary optimized)
              </p>
            </div>

            {/* Fallback Image URL */}
            <div className="pt-2 border-t border-neutral-800">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                Or Image URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value });
                  setPreviewUrl(e.target.value);
                }}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-300 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Classification & Status */}
          <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h3 className="text-base font-bold text-white font-heading">
              Classification & Visibility
            </h3>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-cyan-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Published Toggle */}
            <div className="pt-3 border-t border-neutral-800">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-cyan-500 focus:ring-cyan-500/30"
                />
                <div>
                  <div className="text-sm font-semibold text-white">
                    Publish to Live Portfolio
                  </div>
                  <div className="text-xs text-neutral-400">
                    If unchecked, project remains in Draft mode and will NEVER be visible to the public.
                  </div>
                </div>
              </label>
            </div>

            {/* Featured Toggle */}
            <div className="pt-3 border-t border-neutral-800">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-cyan-500 focus:ring-cyan-500/30"
                />
                <div>
                  <div className="text-sm font-semibold text-white">
                    Featured Project
                  </div>
                  <div className="text-xs text-neutral-400">
                    Highlighted prominently at the top of the portfolio project grid.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-900/30 disabled:opacity-60 transition-all"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving to MongoDB...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Update Project' : 'Save & Create Project'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              disabled={isSubmitting}
              className="w-full px-6 py-3 rounded-xl font-medium text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
