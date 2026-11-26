import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Automatically attach Bearer token if present
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('taskflowUser') || 'null');
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;