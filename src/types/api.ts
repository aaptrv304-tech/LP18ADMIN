// ========================================
// Аутентификация
// ========================================

export interface Admin {
  id: number
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
// Заведения (Venues/Businesses)
// ========================================

export interface Venue {
  id: number
  name: string
  address: string
  description?: string
  image_url?: string
  admin_id: number
  created_at: string
  updated_at: string
  // Дополнительные поля (если есть)
  phone?: string
  website?: string
  rating?: number
  visits_count?: number
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
