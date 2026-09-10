import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { Request, Response } from 'express';
import { Repository } from '../config/store';
import { uploadPDFToCloudinary, deleteFromCloudinary } from '../config/cloudinary';

// PUBLIC API: Download active resume file as an attachment
export const downloadResumeFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const resume = await Repository.getLatestResume();
    const fileName = resume?.fileName || 'Sikandar_Swami_Resume.pdf';
    const fileUrl = resume?.fileUrl || '/resume.pdf';

    // If hosted on Cloudinary or external HTTPS URL
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      try {
        const response = await axios.get(fileUrl, { responseType: 'stream' });
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
        res.setHeader('Content-Type', 'application/pdf');
        response.data.pipe(res);
        return;
      } catch (streamErr: any) {
        console.warn('Failed streaming external resume, redirecting:', streamErr.message);
        res.redirect(fileUrl);
        return;
      }
    }

    // Local static file
    const localPdfPath = fs.existsSync(path.join(process.cwd(), 'frontend', 'public', 'resume.pdf'))
      ? path.join(process.cwd(), 'frontend', 'public', 'resume.pdf')
      : path.join(process.cwd(), 'public', 'resume.pdf');
    if (fs.existsSync(localPdfPath)) {
      const stat = fs.statSync(localPdfPath);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      fs.createReadStream(localPdfPath).pipe(res);
      return;
    }

    res.status(404).json({
      success: false,
      message: 'Resume file not found.',
    });
  } catch (error: any) {
    console.error('Error downloading resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download resume file.',
    });
  }
};

// PUBLIC API: Get current active resume
export const getPublicResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const resume = await Repository.getLatestResume();

    if (!resume) {
      res.status(200).json({
        success: true,
        data: {
          fileName: 'Sikandar_Swami_Resume.pdf',
          fileUrl: '/resume.pdf',
          isDefault: true,
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        fileName: resume.fileName,
        fileUrl: resume.fileUrl,
        updatedAt: resume.updatedAt || resume.createdAt,
        isDefault: resume.publicId === 'default-resume',
      },
    });
  } catch (error: any) {
    console.error('Error fetching public resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve resume.',
    });
  }
};

// ADMIN API: Get resume details
export const getAdminResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const resume = await Repository.getLatestResume();

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve resume details.',
    });
  }
};

// ADMIN API: Upload or replace resume PDF
export const uploadResume = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Please select a valid PDF file to upload.',
      });
      return;
    }

    // Verify it is a PDF
    if (req.file.mimetype !== 'application/pdf' && !req.file.originalname.toLowerCase().endsWith('.pdf')) {
      res.status(400).json({
        success: false,
        message: 'Invalid file format. Only PDF files are accepted.',
      });
      return;
    }

    // Check previous resume to delete old Cloudinary asset
    const previousResume = await Repository.getLatestResume();
    if (previousResume && previousResume.publicId && previousResume.publicId !== 'default-resume') {
      await deleteFromCloudinary(previousResume.publicId, 'raw');
    }

    // Upload new PDF
    const uploadResult = await uploadPDFToCloudinary(
      req.file.buffer,
      req.file.originalname,
      'portfolio/resume'
    );

    const savedResume = await Repository.saveResume({
      fileName: req.file.originalname,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });

    res.status(200).json({
      success: true,
      message: 'Resume PDF uploaded and updated successfully.',
      data: savedResume,
    });
  } catch (error: any) {
    console.error('Error uploading resume:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process resume upload.',
    });
  }
};

// ADMIN API: Delete resume
export const deleteResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const previousResume = await Repository.getLatestResume();

    if (previousResume && previousResume.publicId && previousResume.publicId !== 'default-resume') {
      await deleteFromCloudinary(previousResume.publicId, 'raw');
    }

    await Repository.deleteResume();

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully.',
    });
  } catch (error: any) {
    console.error('Error deleting resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resume.',
    });
  }
};
