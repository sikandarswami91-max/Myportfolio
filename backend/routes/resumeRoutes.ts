import { Router } from 'express';
import {
  getPublicResume,
  downloadResumeFile,
  getAdminResume,
  uploadResume,
  deleteResume,
} from '../controllers/resumeController';
import { authMiddleware } from '../middleware/authMiddleware';
import { uploadResumePDF } from '../middleware/uploadMiddleware';

const router = Router();

// Public routes
router.get('/', getPublicResume);
router.get('/download', downloadResumeFile);

// Admin protected routes
router.get('/admin/resume', authMiddleware as any, getAdminResume);
// /active is the alias used by the admin Dashboard & Resume Manager
// (GET /api/resume/active) — reuses the existing admin resume controller.
router.get('/active', authMiddleware as any, getAdminResume);
// /upload is the alias used by ResumeManager (POST /api/resume/upload) —
// reuses the same upload handler as /admin/resume.
router.post('/upload', authMiddleware as any, uploadResumePDF.single('resume'), uploadResume);
router.post('/admin/resume', authMiddleware as any, uploadResumePDF.single('resume'), uploadResume);
router.delete('/admin/resume', authMiddleware as any, deleteResume);

export default router;
