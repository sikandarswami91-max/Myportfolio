import { Router } from 'express';
import { login, logout, getMe, getSystemStatus } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware as any, getMe as any);
router.get('/status', authMiddleware as any, getSystemStatus as any);

export default router;
