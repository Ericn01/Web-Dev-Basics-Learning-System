import axios from 'axios';

const api = axios.create({
  baseURL: 'http://34.41.137.211:8000/webdev-learning/api' // Setting up the base URL 
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;