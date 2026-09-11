import api from '../api/axios';

// Required resume download filename
export const RESUME_DOWNLOAD_FILENAME = 'Sikandar_Bharti_Resume.pdf';

/**
 * Downloads the resume from the API as a real PDF blob.
 *
 * Uses axios with responseType 'blob' so the browser never interprets the
 * response as HTML/text. The blob's content type is validated before saving,
 * and the file is always saved under the required filename.
 *
 * If the blob request fails for any reason (backend down, proxy/CORS issue,
 * non-PDF response), it falls back to a direct anchor navigation so the
 * browser still downloads via the server's Content-Disposition header.
 */
export async function downloadResumeFile(
  filename: string = RESUME_DOWNLOAD_FILENAME,
  url: string = '/api/resume/download'
): Promise<boolean> {
  try {
    const response = await api.get(url, { responseType: 'blob' });
    const blob: Blob = response.data;

    // Guard: make sure we actually received a PDF, not an HTML/JSON error page
    const contentType = blob?.type || '';
    if (contentType && !contentType.includes('pdf')) {
      throw new Error(`Expected a PDF but received "${contentType}"`);
    }

    const pdfBlob = contentType.includes('pdf')
      ? blob
      : new Blob([blob], { type: 'application/pdf' });

    // Create a temporary object URL and trigger the download with the correct name
    const objectUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
    return true;
  } catch (err) {
    // Fallback: direct navigation. The backend sends
    // Content-Disposition: attachment; filename="Sikandar_Bharti_Resume.pdf"
    // so a plain same-origin anchor still saves a proper PDF.
    console.warn('Blob download failed, using direct link fallback:', err);
    try {
      // Reuse the configured API base URL (supports separately deployed backends)
      const baseURL = api.defaults.baseURL || '';
      const link = document.createElement('a');
      link.href = `${baseURL}${url}`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return false;
    } catch (fallbackErr) {
      console.error('Resume download failed:', fallbackErr);
      window.open(url, '_blank');
      return false;
    }
  }
}


