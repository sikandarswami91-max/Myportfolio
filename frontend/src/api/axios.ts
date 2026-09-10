import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Helper to sanitize and normalize the base URL
const getBaseURL = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (!envUrl || typeof envUrl !== 'string') return '';
  const clean = envUrl.trim().replace(/\/+$/, '').replace(/\/api$/i, '');

  // If in browser and not accessing from localhost (e.g. cloud preview / live domain),
  // never send requests to a localhost/loopback address as browser blocks Private Network Access.
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost && (clean.includes('localhost') || clean.includes('127.0.0.1') || clean.startsWith('http://'))) {
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
