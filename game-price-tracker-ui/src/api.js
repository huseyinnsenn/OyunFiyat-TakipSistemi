import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5017/api'
});

// Her istekte token kontrolü yap ve varsa Header'a ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;