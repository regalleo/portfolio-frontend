import axios from 'axios';

const API_BASE_URL = import.meta.env.REACT_APP_API_ENDPOINT + '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,     
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const skillsAPI = {
  getAll: () => api.get('/skills'),
  getByCategory: (category) => api.get(`/skills/category/${category}`),
};

export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getFeatured: () => api.get('/projects/featured'),
  getByCategory: (category) => api.get(`/projects/category/${category}`),
};

export const experienceAPI = {
  getAll: () => api.get('/experience'),
};

export const aboutAPI = {
  getPrimary: () => api.get('/about/primary'),
};

export const contactAPI = {
  submit: (data) => api.post('/contact', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  sendInterestEmail: (data) => api.post('/contact/interest', data),
};

export default api;
