// Ключ для хранения токена в localStorage
const TOKEN_KEY = 'auth_token'

// Сохранение токена
export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

// Получение токена
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

// Удаление токена
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

// Проверка, авторизован ли пользователь
export const isAuthenticated = (): boolean => {
  return !!getToken()
}

// Декодирование JWT (опционально, для получения данных из токена)
export const decodeToken = (token: string): any => {
  try {
    const payload = token.split('.')[1]
    const decoded = atob(payload)
    return JSON.parse(decoded)
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}
