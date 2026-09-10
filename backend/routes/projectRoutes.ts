import { Router } from 'express';
import {
  getPublicProjects,
  getAdminProjects,
  getAdminProjectById,
  createProject,
  updateProject,
  deleteProject,
  togglePublishProject,
  getDashboardStats,
} from '../controllers/projectController';
import { authMiddleware } from '../middleware/authMiddleware';
import { uploadProjectImage } from '../middleware/uploadMiddleware';

const router = Router();

// Public route: only published projects
router.get('/', getPublicProjects);

// Admin protected routes
router.get('/admin/projects', authMiddleware as any, getAdminProjects);
router.get('/admin/projects/stats', authMiddleware as any, getDashboardStats);
router.get('/admin/projects/:id', authMiddleware as any, getAdminProjectById);
router.post('/admin/projects', authMiddleware as any, uploadProjectImage.single('image'), createProject);
router.put('/admin/projects/:id', authMiddleware as any, uploadProjectImage.single('image'), updateProject);
router.delete('/admin/projects/:id', authMiddleware as any, deleteProject);
router.patch('/admin/projects/:id/publish', authMiddleware as any, togglePublishProject);

export default router;
