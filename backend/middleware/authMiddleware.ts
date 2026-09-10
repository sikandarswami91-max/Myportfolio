import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Repository } from '../config/store';

export interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    email: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. Malformed authorization header.',
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
    const decoded = jwt.verify(token, secret) as { id: string; email: string };

    const admin = await Repository.findAdminById(decoded.id) || await Repository.findAdminByEmail(decoded.email);
    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Admin account not found or invalid session.',
      });
      return;
    }

    req.admin = {
      id: admin._id?.toString() || admin.id,
      email: admin.email,
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again.',
      });
      return;
    }
    res.status(401).json({
      success: false,
      message: 'Invalid or forged authentication token.',
    });
  }
};
