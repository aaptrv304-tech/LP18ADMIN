import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Интерцептор для добавления токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// API методы для админки
export const adminApi = {
  // Статистика
  getStats: () => api.get('/admin/stats'),
  
  // Заведения
  getVenues: () => api.get('/admin/venues'),
  getVenueById: (id: number) => api.get(`/admin/venues/${id}`),
  createVenue: (data: any) => api.post('/admin/venues', data),
  updateVenue: (id: number, data: any) => api.put(`/admin/venues/${id}`, data),
  deleteVenue: (id: number) => api.delete(`/admin/venues/${id}`),
  
  // Посещения
  getVisitsByBusiness: (businessId: number, limit: number = 50) => 
    api.get(`/admin/venues/${businessId}/visits?limit=${limit}`),
  
  // Пользователи
  getUsers: () => api.get('/admin/users'),
  
  // Настройки
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: any) => api.put('/admin/settings', data),
}
