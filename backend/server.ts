import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { initializeData } from './config/store';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import resumeRoutes from './routes/resumeRoutes';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const app = express();
const PORT = process.env.PORT || 5000;

// Production-ready CORS headers support
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

// Body parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static assets (public directory)
const publicPath = path.resolve(__dirname, '../public');
const frontendPublicPath = path.resolve(__dirname, '../frontend/public');
app.use(express.static(publicPath));
app.use(express.static(frontendPublicPath));

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

// Projects API (Public & Admin)
app.use('/api/projects', projectRoutes);
app.use('/api', projectRoutes);

// Resume API (Public & Admin)
app.use('/api/resume', resumeRoutes);
app.use('/api', resumeRoutes);

export async function startBackendServer(port: number | string = PORT) {
  await connectDB();
  await initializeData();

  const numericPort = typeof port === 'string' ? parseInt(port, 10) : port;

  return app.listen(numericPort, '0.0.0.0', () => {
    console.log(`🚀 Backend API Server running at http://0.0.0.0:${numericPort}`);
  });
}

// Auto-run if executed directly (e.g., node backend/server.ts or tsx backend/server.ts)
const isDirectExecution = process.argv[1] && (
  process.argv[1].endsWith('backend/server.ts') ||
  process.argv[1].endsWith('backend/server.js')
);

if (isDirectExecution) {
  startBackendServer(PORT).catch((err) => {
    console.error('Fatal backend startup error:', err);
  });
}
