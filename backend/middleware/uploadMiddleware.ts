import multer from 'multer';
import { Request } from 'express';

// In-memory storage for Cloudinary / buffer handling
const storage = multer.memoryStorage();

// Image file filter
const imageFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image file type. Only JPG, PNG, WEBP, and SVG formats are supported.'));
  }
};

// PDF file filter for Resume
const pdfFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF documents are permitted for the resume.'));
  }
};

export const uploadProjectImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export const uploadResumePDF = multer({
  storage,
  fileFilter: pdfFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
  },
});
