export type ThemeMode = 'dark' | 'light';

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  technologies: string[];
  features: string[];
  liveDemoUrl?: string;
  githubUrl?: string;
  accentColor: string;
  metrics?: string;
  highlights: string[];
}

export interface Skill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools';
  proficiency: 'Advanced' | 'Intermediate' | 'Core Proficient';
  icon: string;
  description: string;
  color: string;
}

export interface ExperienceItem {
  company: string;
  duration: string;
  role: string;
  location: string;
  description: string;
  responsibilities: string[];
  skills: string[];
}

export interface EducationItem {
  degree: string;
  status: string;
  duration: string;
  institution: string;
  description: string;
  highlights: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  icon: string;
}
