import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { connectDB } from './backend/config/db';
import { initializeData } from './backend/config/store';
import authRoutes from './backend/routes/authRoutes';
import projectRoutes from './backend/routes/projectRoutes';
import resumeRoutes from './backend/routes/resumeRoutes';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

// If VITE_API_URL is pointing to a local dev port (e.g. 5173), clear it so the client uses relative API routes
if (process.env.VITE_API_URL && (process.env.VITE_API_URL.includes('5173') || process.env.VITE_API_URL.includes('localhost'))) {
  delete process.env.VITE_API_URL;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Production-ready CORS middleware
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    const configuredClients = (process.env.CLIENT_URL || '')
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean);

    if (configuredClients.length > 0) {
      if (origin && (configuredClients.includes(origin) || configuredClients.includes('*'))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      } else if (!origin) {
        res.setHeader('Access-Control-Allow-Origin', configuredClients[0] || '*');
      }
    } else {
      if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
      }
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // Body parser middlewares
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Static assets from public folder
  app.use(express.static(path.join(process.cwd(), 'public')));
  app.use(express.static(path.join(process.cwd(), 'frontend', 'public')));

  // Initialize DB & Data Seed
  await connectDB();
  await initializeData();

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Sikandar Portfolio API & Private Admin',
      timestamp: new Date().toISOString(),
    });
  });

  // Authentication API
  app.use('/api/auth', authRoutes);

  // Projects API
  // Mounting both at /api/projects for public and /api for /api/admin/projects
  app.use('/api/projects', projectRoutes);
  app.use('/api', projectRoutes);

  // Resume API
  // Mounting at /api/resume for public and /api for /api/admin/resume
  app.use('/api/resume', resumeRoutes);
  app.use('/api', resumeRoutes);

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Portfolio & Admin Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
