import { v2 as cloudinary } from "cloudinary";

const getCloudinaryConfig = () => {
  const cloud_name = (process.env.CLOUDINARY_CLOUD_NAME || "").trim();
  const api_key = (process.env.CLOUDINARY_API_KEY || "").trim();
  const api_secret = (process.env.CLOUDINARY_API_SECRET || "").trim();

  return {
    cloud_name,
    api_key,
    api_secret,
  };
};

/**
 * Check whether all required Cloudinary credentials are available.
 */
export const isCloudinaryConfigured = (): boolean => {
  const { cloud_name, api_key, api_secret } = getCloudinaryConfig();

  return Boolean(cloud_name && api_key && api_secret);
};

let cloudinaryConfigured = false;

const ensureCloudinaryConfigured = (): boolean => {
  if (!isCloudinaryConfigured()) {
    return false;
  }

  if (!cloudinaryConfigured) {
    const { cloud_name, api_key, api_secret } = getCloudinaryConfig();

    cloudinary.config({
      cloud_name,
      api_key,
      api_secret,
      secure: true,
    });

    cloudinaryConfigured = true;

    console.log("✅ Cloudinary configured successfully.");
  }

  return true;
};

/**
 * Upload an image buffer to Cloudinary.
 *
 * If Cloudinary is not configured, a base64 Data URI is returned
 * so local development can continue without Cloudinary.
 */
export const uploadImageToCloudinary = async (
  buffer: Buffer,
  filename: string,
  folder: string = "portfolio/projects",
): Promise<{
  secure_url: string;
  public_id: string;
}> => {
  if (ensureCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const safeFilename = filename
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_");

      const publicId = `${Date.now()}-${safeFilename}`;

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          public_id: publicId,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Cloudinary image upload failed"));
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      );

      uploadStream.end(buffer);
    });
  }

  // Local development fallback
  const extension = filename.split(".").pop()?.toLowerCase() || "png";

  let mimeType = "image/png";

  if (extension === "jpg" || extension === "jpeg") {
    mimeType = "image/jpeg";
  } else if (extension === "webp") {
    mimeType = "image/webp";
  } else if (extension === "gif") {
    mimeType = "image/gif";
  } else if (extension === "svg") {
    mimeType = "image/svg+xml";
  }

  const base64 = `data:${mimeType};base64,${buffer.toString("base64")}`;

  return {
    secure_url: base64,
    public_id: `fallback-${Date.now()}-${filename}`,
  };
};

/**
 * Upload a PDF buffer to Cloudinary.
 *
 * If Cloudinary is not configured, a base64 PDF Data URI is returned.
 */
export const uploadPDFToCloudinary = async (
  buffer: Buffer,
  filename: string,
  folder: string = "portfolio/resume",
): Promise<{
  secure_url: string;
  public_id: string;
}> => {
  if (ensureCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const safeFilename = filename
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_");

      const publicId = `resume-${Date.now()}-${safeFilename}`;

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "raw",
          public_id: publicId,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Cloudinary PDF upload failed"));
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      );

      uploadStream.end(buffer);
    });
  }

  // Local development fallback
  const base64 = `data:application/pdf;base64,${buffer.toString("base64")}`;

  return {
    secure_url: base64,
    public_id: `fallback-resume-${Date.now()}-${filename}`,
  };
};

/**
 * Delete an image/PDF from Cloudinary using its public ID.
 */
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "raw" = "image",
): Promise<boolean> => {
  // Nothing to delete for fallback/local files.
  if (!publicId || publicId.startsWith("fallback-")) {
    return true;
  }

  // If Cloudinary is not configured, don't fail the application.
  if (!ensureCloudinaryConfigured()) {
    return true;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return result.result === "ok";
  } catch (error) {
    console.warn(
      `Failed to delete resource ${publicId} from Cloudinary:`,
      error instanceof Error ? error.message : error,
    );

    return false;
  }
};

export { cloudinary };
