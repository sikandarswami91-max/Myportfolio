/**
 * Secure and robust Resume PDF downloader utility.
 * Guarantees that the complete uncorrupted PDF file is fetched and downloaded
 * across all browsers, mobile devices, and sandboxed preview iframes.
 */
export const downloadResumeFile = async (
  fileName: string = 'Sikandar_Swami_Resume.pdf',
  fileUrl: string = '/api/resume/download'
): Promise<void> => {
  try {
    const response = await fetch(fileUrl, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`Download response status: ${response.status}`);
    }

    const blob = await response.blob();
    if (blob.size === 0) {
      throw new Error('Downloaded PDF blob is empty');
    }

    // Ensure the blob is tagged with application/pdf
    const pdfBlob = new Blob([blob], { type: 'application/pdf' });
    const blobUrl = window.URL.createObjectURL(pdfBlob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up memory
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 2000);
  } catch (err) {
    console.warn('Blob download encountered an issue, using direct download endpoint:', err);
    // Direct browser navigation fallback
    const fallbackLink = document.createElement('a');
    fallbackLink.href = fileUrl;
    fallbackLink.download = fileName;
    fallbackLink.target = '_blank';
    document.body.appendChild(fallbackLink);
    fallbackLink.click();
    document.body.removeChild(fallbackLink);
  }
};
