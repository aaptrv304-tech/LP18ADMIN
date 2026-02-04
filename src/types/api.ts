// ========================================
// Аутентификация
// ========================================

export interface Admin {
  id: string
  telegram_id?: string
  email: string
  business_name: string
  is_active: boolean
  created_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: Admin
}

export interface AuthState {
  user: Admin | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// ========================================
// Заведения (Веню)
// ========================================

export interface Venue {
  id: string
  name: string
  address: string
  description?: string
  image_url?: string
  created_at: string
  updated_at: string
}

// ========================================
// Пользователи (участники лояльности)
// ========================================

export interface User {
  id: string
  telegram_id: string
  username?: string
  first_name?: string
  last_name?: string
  points: number
  visits: number
  created_at: string
}

// ========================================
// Посещения
// ========================================

export interface Visit {
  id: string
  user_id: string
  venue_id: string
  points_earned: number
  created_at: string
}

// ========================================
// Статистика
// ========================================

export interface Stats {
  total_users: number
  total_venues: number
  total_visits: number
  visits_today: number
  visits_this_week: number
  visits_this_month: number
  active_users: number
}
