import axios from 'axios';

// In development, use relative '/api' so Vite's proxy handles it (avoids CORS issues).
// In production (deployed), use the deployed backend URL.
const isLocal = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const baseURL = isLocal
  ? '/api'
  : (import.meta.env.VITE_API_URL || 'https://hub-872l.onrender.com/api');

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor to inject JWT Bearer Token into requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hub_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle responses and global 401s gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      // Don't clear auth or redirect on public auth routes
      if (
        currentPath !== '/login' &&
        currentPath !== '/register' &&
        currentPath !== '/forgot-password' &&
        currentPath !== '/reset-password'
      ) {
        localStorage.removeItem('hub_auth_token');
        localStorage.removeItem('hub_user_profile');
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
