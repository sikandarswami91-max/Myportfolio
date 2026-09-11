import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  publicId?: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  category: string;
  featured: boolean;
  published: boolean;
  features?: string[];
  highlights?: string[];
  accentColor?: string;
  metrics?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Full description is required'],
    },
    image: {
      type: String,
      default: '',
    },
    publicId: {
      type: String,
      default: '',
    },
    technologies: {
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      default: '',
      trim: true,
    },
    liveUrl: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      default: 'Full Stack',
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: true,
    },
    features: {
      type: [String],
      default: [],
    },
    highlights: {
      type: [String],
      default: [],
    },
    accentColor: {
      type: String,
      default: '#06B6D4',
    },
    metrics: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast list queries. The { slug: 1 } index is created implicitly by
// the "unique: true" option on the slug field, so it is not declared again here.
ProjectSchema.index({ published: 1, featured: -1, createdAt: -1 });

export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
