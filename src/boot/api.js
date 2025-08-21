// src/boot/api.js
import axios from 'axios'

// Configura instancia
const api = axios.create({
  baseURL: 'https://localhost:7125/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
