import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Repository } from '../config/store';
import { getDBStatus } from '../config/db';
import { isCloudinaryConfigured } from '../config/cloudinary';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

/* ------------------------------------------------------------------ */
/* Secure Password Reset (Forgot Password)                             */
/* - 32-byte crypto-random token, only its SHA-256 hash is stored      */
/* - 15 minute expiry, single-use (deleted after successful reset)     */
/* - Passwords are bcrypt-hashed before persistence (never stored raw) */
/* - No credentials are ever hardcoded on the frontend                 */
/* ------------------------------------------------------------------ */

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

const resetTokens = new Map<string, { email: string; expiresAt: number }>();

const hashToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');

// Opportunistic cleanup of expired tokens
const pruneExpiredTokens = () => {
  const now = Date.now();
  for (const [key, entry] of resetTokens) {
    if (entry.expiresAt <= now) resetTokens.delete(key);
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      res.status(400).json({ success: false, message: 'Please provide the admin email address.' });
      return;
    }

    pruneExpiredTokens();

    const cleanEmail = email.toLowerCase().trim();
    const admin = await Repository.findAdminByEmail(cleanEmail);

    // Always respond generically — never disclose whether the email exists.
    const genericMessage =
      'If this email belongs to an admin account, a password reset request has been generated. The secure reset link is valid for 15 minutes.';

    if (!admin) {
      res.status(200).json({ success: true, message: genericMessage });
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    resetTokens.set(hashToken(token), { email: cleanEmail, expiresAt: Date.now() + RESET_TOKEN_TTL_MS });

    // No mail provider is configured in this project, so the reset link is
    // delivered through the server console (a server-side channel the public
    // cannot access). In production this can be swapped for an email service
    // without touching the frontend.
    const origin = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
    const resetLink = `${origin}/admin/login?reset_token=${token}`;
    console.log('\n🔐 ===== PASSWORD RESET REQUESTED =====');
    console.log(`👤 Admin: ${cleanEmail}`);
    console.log(`🔗 Reset link (valid 15 minutes): ${resetLink}`);
    console.log('=======================================\n');

    const payload: Record<string, unknown> = {
      success: true,
      message: genericMessage,
    };

    // In non-production environments the token is also returned so the
    // developer can complete the flow without reading server logs.
    if (process.env.NODE_ENV !== 'production') {
      payload.resetToken = token;
    }

    res.status(200).json(payload);
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'An error occurred while processing the reset request.' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || typeof token !== 'string' || !newPassword || typeof newPassword !== 'string') {
      res.status(400).json({ success: false, message: 'Reset token and new password are required.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
      return;
    }

    pruneExpiredTokens();

    const key = hashToken(token);
    const entry = resetTokens.get(key);
    if (!entry || entry.expiresAt <= Date.now()) {
      resetTokens.delete(key);
      res.status(400).json({ success: false, message: 'This reset link is invalid or has expired. Please request a new one.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updated = await Repository.updateAdminPassword(entry.email, hashedPassword);

    // Single-use: consume the token regardless of update outcome.
    resetTokens.delete(key);

    if (!updated) {
      res.status(500).json({ success: false, message: 'Failed to update the password. Please try again.' });
      return;
    }

    console.log(`✅ Password successfully reset for admin: ${entry.email}`);

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now sign in with your new password.',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'An error occurred while resetting the password.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const admin = await Repository.findAdminByEmail(cleanEmail);

    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('❌ Error: JWT_SECRET environment variable is not defined.');
      res.status(500).json({
        success: false,
        message: 'Server configuration error: JWT_SECRET environment variable is missing.',
      });
      return;
    }
    const adminId = admin._id?.toString() || admin.id;

    const token = jwt.sign(
      {
        id: adminId,
        email: admin.email,
      },
      secret,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      admin: {
        id: adminId,
        email: admin.email,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during authentication. Please try again.',
    });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const admin = await Repository.findAdminById(req.admin.id);
    if (!admin) {
      res.status(404).json({ success: false, message: 'Admin not found' });
      return;
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id?.toString() || admin.id,
        email: admin.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch current user profile.',
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

export const getSystemStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const dbStatus = getDBStatus();
  const cloudinaryReady = isCloudinaryConfigured();

  res.status(200).json({
    success: true,
    status: {
      database: {
        connected: dbStatus.isConnected,
        mode: dbStatus.mode,
        label: dbStatus.isConnected ? 'MongoDB Atlas (Connected)' : 'Resilient Fallback Store (Ready)',
      },
      cloudinary: {
        configured: cloudinaryReady,
        label: cloudinaryReady ? 'Cloudinary (Active)' : 'Base64 Local Storage Mode',
      },
    },
  });
};
