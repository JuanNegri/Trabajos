// Codigo de “api.js”

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Cambia esto según tu configuración
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las solicitudes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // Obtener el token del localStorage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Agregar el token al encabezado
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;