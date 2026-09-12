import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Helper to sanitize and normalize the base URL
const getBaseURL = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (!envUrl || typeof envUrl !== 'string') return '';
  const clean = envUrl.trim().replace(/\/+$/, '').replace(/\/api$/i, '');

  // Only reject loopback targets. Browsers block requests from a non-localhost
  // origin (cloud preview domain, phone on LAN, production site) to
  // localhost/127.0.0.1 via Private Network Access. Legitimate remote API
  // URLs (e.g. https://api.onrender.com — or any http:// host on the LAN while
  // testing on a phone) must be preserved, not silently discarded.
  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isLoopbackTarget =
      /^(https?:\/\/)?(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i.test(clean);
    if (!isLocalhost && isLoopbackTarget) {
      // Safe diagnostic (no secrets): makes a silent URL fallback visible so
      // a wrong VITE_API_URL can be spotted instead of failing as a 404/HTML
      // response that surfaces as a generic "invalid credentials" error.
      console.warn(
        `[api] VITE_API_URL (${clean}) targets loopback but the app is served ` +
          `from ${window.location.origin}; falling back to relative /api.`
      );
      return '';
    }
  }

  // If URL targets frontend dev port 5173, fallback to relative API
  if (clean.includes('5173')) {
    return '';
  }

  return clean;
};

const baseURL = getBaseURL();

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor: Attach JWT token automatically
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // If we are on an admin route other than login, clear token and redirect
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
