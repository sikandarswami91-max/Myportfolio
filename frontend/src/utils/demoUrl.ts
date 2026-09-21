import { Project } from '../types';

/**
 * A "placeholder" demo URL is one that does not actually host the project:
 * the portfolio's own domain subdomains (demo-*.sikandar.dev, demo.sikandar.dev),
 * empty strings and bare "#" hashes. Clicking any of these shows nothing,
 * so they must never be used as a Live Demo href.
 */
const isPlaceholderUrl = (url?: string | null): boolean => {
  if (!url || typeof url !== 'string') return true;
  const trimmed = url.trim();
  if (!trimmed || trimmed === '#') return true;
  try {
    const parsed = new URL(trimmed);
    if (!/^https?:$/.test(parsed.protocol)) return true;
    const host = parsed.hostname.toLowerCase();
    return host === 'sikandar.dev' || host.endsWith('.sikandar.dev');
  } catch {
    return true; // not a parseable absolute URL — treat as unusable
  }
};

/**
 * Resolve a working href for the "Live Demo" button:
 *   1. real liveUrl (set by admin or seed data)
 *   2. legacy liveDemoUrl field
 *   3. GitHub repository (so the visitor always lands somewhere that shows the project)
 */
export const resolveDemoUrl = (
  project: Pick<Project, 'liveUrl' | 'liveDemoUrl' | 'githubUrl'>,
): string => {
  const candidates = [project.liveUrl, project.liveDemoUrl, project.githubUrl];
  const real = candidates.find((u) => !isPlaceholderUrl(u));
  if (real) return real as string;
  return project.githubUrl || 'https://github.com/sikandarswami91-max';
};

export default resolveDemoUrl;
