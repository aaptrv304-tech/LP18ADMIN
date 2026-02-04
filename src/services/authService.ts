import axios from 'axios'
import type { LoginRequest, LoginResponse, Admin } from '../types/api'

// Типы для import.meta.env
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

const API_BASE_URL = (import.meta as ImportMeta).env.VITE_API_URL || '/api'

// Создаём экземпляр axios для аутентификации
export const authService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Логин
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await authService.post<LoginResponse>('/admin/login', credentials)
  return response.data
}

// Получение профиля текущего пользователя
export const getProfile = async (token: string): Promise<Admin> => {
  const response = await authService.get<Admin>('/admin/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

// Логаут (если нужен эндпоинт на бэкенде)
export const logout = async (): Promise<void> => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    await authService.post(
      '/admin/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  }
}
