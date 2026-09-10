import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { Project, IProject } from '../models/Project';
import { Resume, IResume } from '../models/Resume';
import { Admin, IAdmin } from '../models/Admin';
import { getDBStatus } from './db';

// Store location prioritized in backend/data/store.json
const getStoreFilePath = (): string => {
  const backendData = path.join(process.cwd(), 'backend', 'data', 'store.json');
  if (fs.existsSync(backendData)) return backendData;
  const relativeBackendData = path.join(__dirname, '..', 'data', 'store.json');
  if (fs.existsSync(relativeBackendData)) return relativeBackendData;
  const rootData = path.join(process.cwd(), 'data', 'store.json');
  if (fs.existsSync(rootData)) return rootData;
  return backendData;
};

const STORE_FILE = getStoreFilePath();

const persistLocalStore = () => {
  try {
    const payload = JSON.stringify(
      {
        projects: inMemoryProjects,
        resume: inMemoryResume,
        admins: inMemoryAdmins,
      },
      null,
      2
    );

    // Save to primary backend/data/store.json
    const primaryDir = path.join(process.cwd(), 'backend', 'data');
    if (!fs.existsSync(primaryDir)) {
      fs.mkdirSync(primaryDir, { recursive: true });
    }
    fs.writeFileSync(path.join(primaryDir, 'store.json'), payload);
  } catch (err) {
    // Non-fatal
  }
};

const loadLocalStore = () => {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      const data = JSON.parse(content);
      if (Array.isArray(data.projects) && data.projects.length > 0) {
        inMemoryProjects = data.projects;
      }
      if (data.resume) {
        inMemoryResume = data.resume;
      }
      if (Array.isArray(data.admins) && data.admins.length > 0) {
        inMemoryAdmins = data.admins;
      }
      return true;
    }
  } catch {
    // Non-fatal
  }
  return false;
};

// Initial projects from portfolioData
const INITIAL_PROJECTS = [
  {
    title: 'Virtual AI Assistant',
    slug: 'virtual-ai-assistant',
    shortDescription: 'A virtual AI assistant web application with an interactive user interface and voice-based functionality.',
    description: 'Engineered a real-time smart virtual assistant web platform combining natural speech recognition with intelligent response generation. Features a tactile conversational UI, real-time speech synthesis, audio wave visualizations, command history, and persistent session storage.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'SpeechRecognition API', 'Tailwind CSS'],
    githubUrl: 'https://github.com/sikandarswami91-max/virtual-ai-assistant',
    liveUrl: 'https://demo-ai-assistant.sikandar.dev',
    category: 'AI & Full Stack',
    featured: true,
    published: true,
    accentColor: '#38BDF8',
    metrics: '99.2% Voice Recognition Accuracy',
    features: [
      'Interactive voice-driven speech recognition and natural text-to-speech feedback',
      'Real-time animated audio visualizer responsive to voice input frequency',
      'Categorized prompt suggestions for web searches, math queries, and daily productivity',
      'MongoDB persistent storage for user queries, session logs, and personalized preferences',
    ],
    highlights: ['Voice & Text Hybrid Mode', 'Instant AI Query Resolution', 'History Tracking'],
  },
  {
    title: 'E-Commerce Website',
    slug: 'ecommerce-website',
    shortDescription: 'A modern e-commerce application with product browsing, user interaction, and responsive design.',
    description: 'Comprehensive full-stack digital shopping storefront built from the ground up. Incorporates catalog faceted search, real-time cart state with price breakdowns, simulated checkout flows, product reviews, and an administrative inventory control panel.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT Auth', 'Tailwind CSS'],
    githubUrl: 'https://github.com/sikandarswami91-max/mern-ecommerce-store',
    liveUrl: 'https://demo-ecommerce.sikandar.dev',
    category: 'Full Stack',
    featured: true,
    published: true,
    accentColor: '#10B981',
    metrics: 'Sub-100ms Search Response',
    features: [
      'Dynamic product catalog with multi-facet category, price range, and rating filters',
      'Responsive slide-out shopping cart drawer with instant quantity recalculation',
      'JWT-authenticated user registration, order history, and saved wishlists',
      'Secure MongoDB schema with Mongoose relations for orders, products, and users',
    ],
    highlights: ['Faceted Filter & Search', 'Slide-out Cart Drawer', 'Responsive Product Grid'],
  },
  {
    title: 'Hospital Management System',
    slug: 'hospital-management-system',
    shortDescription: 'A web application designed to manage hospital-related information and provide a user-friendly interface.',
    description: 'An enterprise-grade clinic and hospital portal designed to organize patient onboarding, doctor scheduling, ward availability, and medical diagnostic records into an intuitive, unified dashboard.',
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1000&auto=format&fit=crop',
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Chart.js'],
    githubUrl: 'https://github.com/sikandarswami91-max/hospital-management-system',
    liveUrl: 'https://demo-hospital.sikandar.dev',
    category: 'Healthcare',
    featured: false,
    published: true,
    accentColor: '#6366F1',
    metrics: 'Organized 5+ Core Departments',
    features: [
      'Patient registration portal with medical history timeline and status tags',
      'Doctor appointment scheduling system with date/time slot conflict detection',
      'Interactive department directory for cardiology, neurology, pediatrics, and emergency',
      'Express.js RESTful API endpoints handling role-based access for staff and admins',
    ],
    highlights: ['Role-based Medical Dashboard', 'Appointment Scheduler', 'Digital Patient Records'],
  },
  {
    title: 'Mithai Shop Website',
    slug: 'mithai-shop-website',
    shortDescription: 'A modern sweets shop website with product presentation, contact options, and location information.',
    description: 'A visually rich, culture-inspired digital storefront for an authentic traditional sweets brand. Displays hand-crafted confectionery gift boxes, seasonal festive assortments, nutritional ingredient disclosures, one-tap WhatsApp ordering, and interactive store locator details.',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1000&auto=format&fit=crop',
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Framer Motion', 'Tailwind CSS'],
    githubUrl: 'https://github.com/sikandarswami91-max/mithai-shop-showcase',
    liveUrl: 'https://demo-mithaishop.sikandar.dev',
    category: 'Modern Web',
    featured: false,
    published: true,
    accentColor: '#F59E0B',
    metrics: 'Fast 60fps Scrolling & Animations',
    features: [
      'High-resolution visual showcase of traditional sweets, dry fruits, and festive gift hampers',
      'Interactive festive packaging selector with customized message tags',
      'Direct one-click WhatsApp order inquiry and direct phone contact integration',
      'Integrated Google Maps store locator with opening hours and directions',
    ],
    highlights: ['Festive Sweets Showcase', 'WhatsApp Order Inquiry', 'Interactive Timings'],
  },
];

// In-memory collections
let inMemoryProjects: any[] = [];
let inMemoryResume: any = null;
let inMemoryAdmins: any[] = [];

/**
 * Initialize repository data and seed admin
 */
export const initializeData = async () => {
  const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || '';
  const hashedPassword = adminPassword ? await bcrypt.hash(adminPassword, 10) : '';

  const hasLoaded = loadLocalStore();
  if (!hasLoaded) {
    // Setup memory admin
    inMemoryAdmins = [
      {
        _id: 'admin-seed-1',
        id: 'admin-seed-1',
        email: adminEmail,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Setup memory projects
    inMemoryProjects = INITIAL_PROJECTS.map((p, idx) => ({
      ...p,
      _id: `project-${idx + 1}-${p.slug}`,
      id: `project-${idx + 1}-${p.slug}`,
      createdAt: new Date(Date.now() - idx * 86400000),
      updatedAt: new Date(Date.now() - idx * 86400000),
    }));

    // Setup default memory resume
    inMemoryResume = {
      _id: 'resume-default-1',
      id: 'resume-default-1',
      fileName: 'Sikandar_Swami_Resume.pdf',
      fileUrl: '/resume.pdf',
      publicId: 'default-resume',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    persistLocalStore();
  } else {
    // Ensure admin user exists with current credentials
    if (!inMemoryAdmins.some((a) => a.email.toLowerCase() === adminEmail)) {
      inMemoryAdmins.push({
        _id: 'admin-seed-1',
        id: 'admin-seed-1',
        email: adminEmail,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      persistLocalStore();
    }
  }

  const dbStatus = getDBStatus();
  if (dbStatus.isConnected) {
    try {
      // Seed Admin in MongoDB if none exists
      const existingAdmin = await (Admin as any).findOne({ email: adminEmail });
      if (!existingAdmin) {
        await (Admin as any).create({
          email: adminEmail,
          password: hashedPassword,
        });
        console.log(`✅ Default admin seeded in MongoDB: ${adminEmail}`);
      }

      // Seed Projects in MongoDB if none exists
      const projectCount = await (Project as any).countDocuments();
      if (projectCount === 0) {
        await (Project as any).insertMany(INITIAL_PROJECTS);
        console.log('✅ Initial portfolio projects seeded in MongoDB.');
      }

      // Seed Resume in MongoDB if none exists
      const existingResume = await (Resume as any).findOne();
      if (!existingResume) {
        await (Resume as any).create({
          fileName: 'Sikandar_MERN_Resume.pdf',
          fileUrl: '/resume.pdf',
          publicId: 'default-resume',
        });
      }
    } catch (err) {
      console.log('ℹ️ MongoDB initial seed check skipped:', (err as Error).message);
    }
  }
};

export const Repository = {
  // Admin Operations
  async findAdminByEmail(email: string) {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      try {
        return await (Admin as any).findOne({ email: email.toLowerCase().trim() });
      } catch (e) {
        // Fallback to local store
      }
    }
    return inMemoryAdmins.find((a) => a.email.toLowerCase() === email.toLowerCase().trim()) || null;
  },

  async findAdminById(id: string) {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      try {
        return await (Admin as any).findById(id);
      } catch (e) {
        // Fallback to local store
      }
    }
    return inMemoryAdmins.find((a) => a._id === id || a.id === id) || null;
  },

  async createAdmin(email: string, hashedPassword: string) {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      return await (Admin as any).create({ email: email.toLowerCase().trim(), password: hashedPassword });
    }
    const newAdmin = {
      _id: `admin-${Date.now()}`,
      id: `admin-${Date.now()}`,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryAdmins.push(newAdmin);
    persistLocalStore();
    return newAdmin;
  },

  // Project Operations
  async getPublicProjects() {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      try {
        return await (Project as any).find({ published: true }).sort({ featured: -1, createdAt: -1 });
      } catch (e) {
        // Fallback
      }
    }
    return inMemoryProjects
      .filter((p) => p.published === true)
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getAllProjects(filter?: { search?: string; status?: string; category?: string }) {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      try {
        const query: any = {};
        if (filter?.status === 'published') query.published = true;
        if (filter?.status === 'draft') query.published = false;
        if (filter?.status === 'featured') query.featured = true;
        if (filter?.category && filter.category !== 'all') query.category = filter.category;
        if (filter?.search) {
          query.$or = [
            { title: { $regex: filter.search, $options: 'i' } },
            { description: { $regex: filter.search, $options: 'i' } },
            { technologies: { $regex: filter.search, $options: 'i' } },
          ];
        }
        return await (Project as any).find(query).sort({ createdAt: -1 });
      } catch (e) {
        // Fallback
      }
    }

    let list = [...inMemoryProjects];
    if (filter?.status === 'published') list = list.filter((p) => p.published);
    if (filter?.status === 'draft') list = list.filter((p) => !p.published);
    if (filter?.status === 'featured') list = list.filter((p) => p.featured);
    if (filter?.category && filter.category !== 'all') list = list.filter((p) => p.category === filter.category);
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.technologies?.some((t: string) => t.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getProjectById(id: string) {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      try {
        return await (Project as any).findById(id);
      } catch (e) {
        // Continue to fallback
      }
    }
    return inMemoryProjects.find((p) => p._id === id || p.id === id || p.slug === id) || null;
  },

  async getProjectBySlug(slug: string) {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      try {
        return await (Project as any).findOne({ slug });
      } catch (e) {
        // Continue to fallback
      }
    }
    return inMemoryProjects.find((p) => p.slug === slug) || null;
  },

  async createProject(projectData: any) {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      try {
        return await (Project as any).create(projectData);
      } catch (e) {
        console.log('ℹ️ Saving project to local persistent store.');
      }
    }
    const newProject = {
      ...projectData,
      _id: `project-${Date.now()}-${projectData.slug}`,
      id: `project-${Date.now()}-${projectData.slug}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryProjects.unshift(newProject);
    persistLocalStore();
    return newProject;
  },

  async updateProject(id: string, updateData: any) {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      try {
        const updated = await (Project as any).findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true });
        if (updated) return updated;
      } catch (e) {
        // Fallback
      }
    }
    const index = inMemoryProjects.findIndex((p) => p._id === id || p.id === id);
    if (index !== -1) {
      inMemoryProjects[index] = {
        ...inMemoryProjects[index],
        ...updateData,
        updatedAt: new Date(),
      };
      persistLocalStore();
      return inMemoryProjects[index];
    }
    return null;
  },

  async deleteProject(id: string) {
    const dbStatus = getDBStatus();
    let deletedDoc: any = null;
    if (dbStatus.isConnected) {
      try {
        deletedDoc = await (Project as any).findByIdAndDelete(id);
      } catch (e) {
        // Fallback
      }
    }
    const index = inMemoryProjects.findIndex((p) => p._id === id || p.id === id);
    if (index !== -1) {
      deletedDoc = inMemoryProjects[index];
      inMemoryProjects.splice(index, 1);
      persistLocalStore();
    }
    return deletedDoc;
  },

  // Resume Operations
  async getLatestResume() {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      try {
        const resume = await Resume.findOne().sort({ updatedAt: -1 });
        if (resume) return resume;
      } catch (e) {
        // Fallback
      }
    }
    return inMemoryResume;
  },

  async saveResume(resumeData: { fileName: string; fileUrl: string; publicId?: string }) {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      try {
        // Upsert latest resume
        let resume = await Resume.findOne();
        if (resume) {
          resume.fileName = resumeData.fileName;
          resume.fileUrl = resumeData.fileUrl;
          if (resumeData.publicId) resume.publicId = resumeData.publicId;
          resume.updatedAt = new Date();
          await resume.save();
          inMemoryResume = resume;
          return resume;
        } else {
          resume = await Resume.create(resumeData);
          inMemoryResume = resume;
          return resume;
        }
      } catch (e) {
        console.log('ℹ️ Saving resume to local persistent store.');
      }
    }

    inMemoryResume = {
      _id: 'resume-custom-1',
      id: 'resume-custom-1',
      fileName: resumeData.fileName,
      fileUrl: resumeData.fileUrl,
      publicId: resumeData.publicId || '',
      createdAt: inMemoryResume ? inMemoryResume.createdAt : new Date(),
      updatedAt: new Date(),
    };
    persistLocalStore();
    return inMemoryResume;
  },

  async deleteResume() {
    const dbStatus = getDBStatus();
    let previous = inMemoryResume;
    if (dbStatus.isConnected) {
      try {
        await Resume.deleteMany({});
      } catch (e) {
        // Fallback
      }
    }
    inMemoryResume = null;
    persistLocalStore();
    return previous;
  },
};
