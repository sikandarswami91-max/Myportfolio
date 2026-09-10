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
router.post('/admin/resume', authMiddleware as any, uploadResumePDF.single('resume'), uploadResume);
router.delete('/admin/resume', authMiddleware as any, deleteResume);

export default router;
