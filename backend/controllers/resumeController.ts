import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { Request, Response } from 'express';
import { Repository } from '../config/store';
import { uploadPDFToCloudinary, deleteFromCloudinary } from '../config/cloudinary';
import { generateResumePdf } from '../services/resumePdfService';

// Required download filename for the public resume
const RESUME_FILE_NAME = 'Sikandar_Bharti_Resume.pdf';

const setPdfHeaders = (res: Response, byteLength: number) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${RESUME_FILE_NAME}"`);
  res.setHeader('Content-Length', String(byteLength));
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
};

// Fallback: dynamically generated, always-available professional PDF resume
const sendGeneratedResume = async (res: Response): Promise<void> => {
  const pdfBytes = await generateResumePdf();
  const buffer = Buffer.from(pdfBytes);
  setPdfHeaders(res, buffer.length);
  res.end(buffer);
};

// PUBLIC API: Download active resume file as an attachment
export const downloadResumeFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const resume = await Repository.getLatestResume();
    const fileUrl = resume?.fileUrl || '/resume.pdf';

    // Uploaded resume stored as a base64 Data URI (local dev fallback when
    // Cloudinary is not configured) — decode and serve the EXACT uploaded bytes.
    if (fileUrl.startsWith('data:')) {
      const isPdf = fileUrl.slice(0, 60).toLowerCase().includes('application/pdf');
      if (isPdf) {
        const base64 = fileUrl.slice(fileUrl.indexOf(',') + 1);
        const buffer = Buffer.from(base64, 'base64');
        setPdfHeaders(res, buffer.length);
        res.end(buffer);
        return;
      }
      // Data URI is not a PDF record — fall through to generated fallback
      await sendGeneratedResume(res);
      return;
    }

    // If hosted on Cloudinary or external HTTPS URL, stream it as a PDF attachment.
    // On any failure we fall back to the generated PDF instead of redirecting
    // (a redirect loses the attachment headers and can yield HTML responses).
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      try {
        const response = await axios.get(fileUrl, { responseType: 'arraybuffer', timeout: 20000 });
        const contentType = String(response.headers['content-type'] || 'application/pdf');
        const buffer = Buffer.from(response.data as ArrayBuffer);
        setPdfHeaders(res, buffer.length);
        if (contentType.startsWith('application/pdf')) {
          res.setHeader('Content-Type', contentType);
        }
        res.end(buffer);
        return;
      } catch (streamErr: any) {
        console.warn('Failed fetching external resume, serving generated PDF:', streamErr.message);
        await sendGeneratedResume(res);
        return;
      }
    }

    // Local static file in public directory
    const localPdfPath = path.join(process.cwd(), 'public', 'resume.pdf');
    if (fs.existsSync(localPdfPath)) {
      const stat = fs.statSync(localPdfPath);
      setPdfHeaders(res, stat.size);
      fs.createReadStream(localPdfPath).pipe(res);
      return;
    }

    // No uploaded/default resume available — generate a genuine PDF on the fly.
    // Never return a JSON/HTML error here (that is what caused .htm downloads).
    await sendGeneratedResume(res);
  } catch (error: any) {
    console.error('Error downloading resume:', error);
    try {
      // Last-resort fallback so the user always receives a valid PDF
      await sendGeneratedResume(res);
    } catch (genErr) {
      res.status(500).json({
        success: false,
        message: 'Failed to download resume file.',
      });
    }
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
