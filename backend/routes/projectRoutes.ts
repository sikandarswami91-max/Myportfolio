import { Router } from 'express';
import {
  getPublicProjects,
  getPublicProjectByIdOrSlug,
  getAdminProjects,
  getAdminProjectById,
  createProject,
  updateProject,
  deleteProject,
  togglePublishProject,
  toggleFeaturedProject,
  getDashboardStats,
} from '../controllers/projectController';
import { authMiddleware } from '../middleware/authMiddleware';
import { uploadProjectImage } from '../middleware/uploadMiddleware';

const router = Router();

// Public route: only published projects
router.get('/', getPublicProjects);

// Admin protected routes
// NOTE: static routes must stay BEFORE '/:id' style params inside the same
// router so Express never mistakes e.g. "stats" for an :id value.
router.get('/admin/projects', authMiddleware as any, getAdminProjects);
router.get('/admin/projects/stats', authMiddleware as any, getDashboardStats);
router.get('/admin/projects/:id', authMiddleware as any, getAdminProjectById);
router.post('/admin/projects', authMiddleware as any, uploadProjectImage.single('image'), createProject);
router.put('/admin/projects/:id', authMiddleware as any, uploadProjectImage.single('image'), updateProject);
router.delete('/admin/projects/:id', authMiddleware as any, deleteProject);
router.patch('/admin/projects/:id/publish', authMiddleware as any, togglePublishProject);
router.patch('/admin/projects/:id/featured', authMiddleware as any, toggleFeaturedProject);

// Public single-project lookup by Mongo _id OR slug.
// Mounted at /api/projects (see server.ts) this serves:
//   GET /api/projects/:id  -> used by the public Project Details page.
// It is registered AFTER the multi-segment /admin/* routes above, and it only
// matches a SINGLE path segment, so /admin/projects... can never collide with it.
router.get('/:id', getPublicProjectByIdOrSlug);

export default router;
