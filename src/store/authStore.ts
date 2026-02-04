import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Admin, AuthState } from '../types/api'
import { login, getProfile } from '../services/authService'
import { saveToken, getToken, removeToken } from '../utils/auth'

interface AuthStore extends AuthState {
  // Действия
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  setUser: (user: Admin | null) => void
  setToken: (token: string | null) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: getToken(),
      isAuthenticated: !!getToken(),
      isLoading: false,

      // Логин
      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await login({ email, password })
          
          saveToken(response.token)
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      // Логаут
      logout: () => {
        removeToken()
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      // Проверка аутентификации при загрузке приложения
      checkAuth: async () => {
        const token = getToken()
        if (token) {
          set({ isLoading: true })
          try {
            const user = await getProfile(token)
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            })
          } catch (error) {
            // Если токен невалидный, очищаем его
            removeToken()
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            })
          }
        }
      },

      // Установка пользователя
      setUser: (user: Admin | null) => {
        set({ user })
      },

      // Установка токена
      setToken: (token: string | null) => {
        if (token) {
          saveToken(token)
        } else {
          removeToken()
        }
        set({ token, isAuthenticated: !!token })
      },
    }),
    {
      name: 'auth-storage', // имя для localStorage
    }
  )
)
