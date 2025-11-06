import axios from 'axios';

// Make sure REACT_APP_API_ENDPOINT is set in .env
const API_BASE_URL = import.meta.env.REACT_APP_API_ENDPOINT + '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor to log errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Skills API
export const skillsAPI = {
  getAll: async () => {
    const res = await api.get('/skills');
    return Array.isArray(res) ? res : res?.data || [];
  },
  getByCategory: (category) => api.get(`/skills/category/${category}`),
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    const res = await api.get('/projects');
    return Array.isArray(res) ? res : res?.data || [];
  },
  getFeatured: () => api.get('/projects/featured'),
  getByCategory: (category) => api.get(`/projects/category/${category}`),
};

// Experience API
export const experienceAPI = {
  getAll: async () => {
    const res = await api.get('/experience');
    return Array.isArray(res) ? res : res?.data || [];
  },
};

// About API
export const aboutAPI = {
  getPrimary: () => api.get('/about/primary'),
  getAll: () => api.get('/about'),
  getById: (id) => api.get(`/about/${id}`),
};

// Contact API
export const contactAPI = {
  submit: (data) =>
    api.post('/contact', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  sendInterestEmail: (data) => api.post('/contact/interest', data),
};

export default api;
