export type ThemeMode = 'light' | 'dark';

export interface Project {
  id: string;
  _id?: string;
  title: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  fullDescription?: string;
  longDescription?: string;
  features?: string[];
  image?: string;
  tags?: string[];
  technologies: string[];
  category: string;
  featured?: boolean;
  liveUrl?: string;
  liveDemoUrl?: string;
  githubUrl: string;
  demoUrl?: string;
  highlights?: string[];
  keyFeatures?: string[];
  architecture?: string[];
  published?: boolean;
  accentColor?: string;
  metrics?: string;
  createdAt?: string;
}

export interface Skill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools & DevOps' | 'Concepts & Languages' | string;
  proficiency: string;
  icon: string;
  color?: string;
  description?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  location?: string;
  period?: string;
  duration?: string;
  description: string;
  skills: string[];
  type?: string;
  responsibilities?: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  location?: string;
  period?: string;
  duration?: string;
  status?: string;
  score?: string;
  details?: string;
  description?: string;
  highlights?: string[];
  courses?: string[];
}

export interface ServiceItem {
  id?: string;
  title: string;
  tagline?: string;
  description: string;
  icon: string;
  deliverables: string[];
}
