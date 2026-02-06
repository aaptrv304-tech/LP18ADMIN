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
  
  // Статистика заведения
  getVenueStats: (venueId: number) => api.get(`/admin/venues/${venueId}/stats`),
  
  // Посещения с пагинацией
  getVisitsByBusiness: (businessId: number, page: number = 1, limit: number = 20) => 
    api.get(`/admin/venues/${businessId}/visits?page=${page}&limit=${limit}`),
  
  // Данные для графика посещений
  getVisitsChartData: (businessId: number, days: number = 14) => 
    api.get(`/admin/venues/${businessId}/visits-chart?days=${days}`),
  
  // Топ посетителей
  getTopVisitors: (businessId: number, limit: number = 5) => 
    api.get(`/admin/venues/${businessId}/top-visitors?limit=${limit}`),
  
  // Награды
  getRewards: (businessId: number) => api.get(`/admin/venues/${businessId}/rewards`),
  createReward: (businessId: number, reward: any) => api.post(`/admin/venues/${businessId}/rewards`, reward),
  updateReward: (rewardId: number, reward: any) => api.put(`/admin/rewards/${rewardId}`, reward),
  deleteReward: (rewardId: number) => api.delete(`/admin/rewards/${rewardId}`),
  toggleRewardActive: (rewardId: number) => api.patch(`/admin/rewards/${rewardId}/toggle-active`),
  
  // Пользователи
  getUsers: () => api.get('/admin/users'),
  
  // Настройки
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: any) => api.put('/admin/settings', data),
}
