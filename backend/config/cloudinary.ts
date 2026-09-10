import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

const getCloudinaryConfig = () => {
  const cloud_name = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
  const api_key = (process.env.CLOUDINARY_API_KEY || '').trim();
  const api_secret = (process.env.CLOUDINARY_API_SECRET || '').trim();
  return { cloud_name, api_key, api_secret };
};

// Check if Cloudinary is configured
export const isCloudinaryConfigured = (): boolean => {
  const { cloud_name, api_key, api_secret } = getCloudinaryConfig();
  return Boolean(cloud_name && api_key && api_secret);
};

// Initialize Cloudinary
if (isCloudinaryConfigured()) {
  const { cloud_name, api_key, api_secret } = getCloudinaryConfig();
  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
  });
  console.log('✅ Cloudinary configured successfully.');
} else {
  console.log('ℹ️ Cloudinary credentials not configured yet. Fallback data storage enabled for uploads.');
}

/**
 * Upload an image buffer to Cloudinary or return a base64 Data URI if not configured.
 */
export const uploadImageToCloudinary = async (
  buffer: Buffer,
  filename: string,
  folder: string = 'portfolio/projects'
): Promise<{ secure_url: string; public_id: string }> => {
  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          public_id: `${Date.now()}-${filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')}`,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Cloudinary image upload failed'));
          }
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );
      uploadStream.end(buffer);
    });
  }

  // Fallback: Data URI for instant local development
  const extension = filename.split('.').pop()?.toLowerCase() || 'png';
  const mimeType = extension === 'svg' ? 'image/svg+xml' : `image/${extension === 'jpg' ? 'jpeg' : extension}`;
  const base64 = `data:${mimeType};base64,${buffer.toString('base64')}`;
  return {
    secure_url: base64,
    public_id: `fallback-${Date.now()}-${filename}`,
  };
};

/**
 * Upload a PDF buffer to Cloudinary or return a base64 Data URI if not configured.
 */
export const uploadPDFToCloudinary = async (
  buffer: Buffer,
  filename: string,
  folder: string = 'portfolio/resume'
): Promise<{ secure_url: string; public_id: string }> => {
  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'raw',
          public_id: `resume-${Date.now()}-${filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Cloudinary PDF upload failed'));
          }
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );
      uploadStream.end(buffer);
    });
  }

  // Fallback: PDF Data URI
  const base64 = `data:application/pdf;base64,${buffer.toString('base64')}`;
  return {
    secure_url: base64,
    public_id: `fallback-resume-${Date.now()}-${filename}`,
  };
};

/**
 * Delete a resource from Cloudinary by public ID.
 */
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: 'image' | 'raw' = 'image'
): Promise<boolean> => {
  if (!isCloudinaryConfigured() || !publicId || publicId.startsWith('fallback-')) {
    return true;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result.result === 'ok';
  } catch (error) {
    console.warn(`Failed to delete resource ${publicId} from Cloudinary:`, (error as Error).message);
    return false;
  }
};

export { cloudinary };
