import axios from 'axios';

const testApi = axios.create({
  baseURL: 'http://localhost:8000/webdev-learning/api'
});

const api = axios.create({
  baseURL: 'https://web-dev-basics-learning-system.onrender.com/webdev-learning/api' // Setting up the base URL 
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;