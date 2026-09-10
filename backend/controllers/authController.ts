import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Repository } from '../config/store';
import { getDBStatus } from '../config/db';
import { isCloudinaryConfigured } from '../config/cloudinary';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

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
