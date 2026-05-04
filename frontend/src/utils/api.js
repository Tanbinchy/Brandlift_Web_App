import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use(config => {
  if (config.headers?.Authorization) return config;
  const adminToken = localStorage.getItem('bl_token');
  const userToken  = localStorage.getItem('bl_user_token');
  const token = adminToken || userToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const path = window.location.pathname;
      if (path.startsWith('/admin') && path !== '/admin/login') {
        localStorage.removeItem('bl_token'); localStorage.removeItem('bl_admin');
        window.location.href = '/admin/login';
      } else if (path.startsWith('/dashboard')) {
        localStorage.removeItem('bl_user_token'); localStorage.removeItem('bl_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const userApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});
userApi.interceptors.request.use(config => {
  if (config.headers?.Authorization) return config;
  const token = localStorage.getItem('bl_user_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
