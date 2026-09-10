export async function downloadResumeFile(url: string = '/resume.pdf', filename: string = 'Sikandar_Swami_MERN_Stack_Resume.pdf'): Promise<void> {
  try {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading resume:', error);
    window.open(url, '_blank');
  }
}
