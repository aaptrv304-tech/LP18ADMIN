import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { isAuthenticated } from './utils/auth'

// Цвета бренда "Апельсинчик"
const COLORS = {
  primary: '#ff6b35',
  primaryDark: '#e55a2b',
  secondary: '#ffa500',
  background: '#fffaf0',
  text: '#333333',
  lightGray: '#f5f5f5',
  border: '#e0e0e0',
  success: '#28a745',
  error: '#dc3545',
}

// ========================================
// Лендинг
// ========================================

const Landing = () => {
  return (
    <div style={{ 
      padding: '60px 20px', 
      textAlign: 'center',
      backgroundColor: COLORS.background,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ maxWidth: '600px' }}>
        <h1 style={{ 
          fontSize: '48px', 
          marginBottom: '20px',
          color: COLORS.primary,
          fontWeight: 'bold'
        }}>
          🍊 Апельсинчик
        </h1>
        <p style={{ 
          fontSize: '20px', 
          color: COLORS.text,
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          Система лояльности на базе Telegram Mini App
        </p>
        <button 
          onClick={() => window.location.href = '/login'}
          style={{ 
            marginTop: '20px', 
            padding: '14px 40px', 
            backgroundColor: COLORS.primary,
            color: 'white', 
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryDark}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
        >
          Войти в админку
        </button>
      </div>
    </div>
  )
}

// ========================================
// Логин
// ========================================

const Login = () => {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      await login(email, password)
      setSuccess('Успешный вход!')
      // Редирект произойдёт автоматически через защищённый роут
    } catch (err: any) {
      console.error('Login error:', err)
      if (err.response) {
        // Сервер вернул ошибку
        setError(err.response.data.message || 'Ошибка авторизации')
      } else if (err.request) {
        // Нет ответа от сервера
        setError('Не удалось подключиться к серверу')
      } else {
        // Ошибка при настройке запроса
        setError('Произошла ошибка при отправке запроса')
      }
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: COLORS.background
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '50px', 
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: COLORS.primary,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            color: 'white',
            fontSize: '28px'
          }}>
            🍊
          </div>
          <h2 style={{ 
            marginBottom: '10px', 
            color: COLORS.text,
            fontSize: '28px'
          }}>
            Добро пожаловать!
          </h2>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Войдите в админ-панель
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: COLORS.error + '15',
            color: COLORS.error,
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            border: `1px solid ${COLORS.error}`
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: COLORS.success + '15',
            color: COLORS.success,
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            border: `1px solid ${COLORS.success}`
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              color: COLORS.text,
              fontWeight: '500'
            }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Введите ваш email"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'border-color 0.3s',
                backgroundColor: '#fafafa'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = COLORS.primary}
              onBlur={(e) => e.currentTarget.style.borderColor = COLORS.border}
            />
          </div>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              color: COLORS.text,
              fontWeight: '500'
            }}>
              Пароль:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Введите пароль"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'border-color 0.3s',
                backgroundColor: '#fafafa'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = COLORS.primary}
              onBlur={(e) => e.currentTarget.style.borderColor = COLORS.border}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: isLoading ? '#ccc' : COLORS.primary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = COLORS.primaryDark
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = COLORS.primary
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)'
              }
            }}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ========================================
// Дашборд
// ========================================

const Dashboard = () => {
  const { user, logout } = useAuth()

  return (
    <div style={{ 
      backgroundColor: COLORS.lightGray,
      minHeight: '100vh'
    }}>
      {/* Хедер */}
      <header style={{
        backgroundColor: 'white',
        padding: '20px 40px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ 
            color: COLORS.primary,
            margin: 0,
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            🍊 Апельсинчик
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ color: COLORS.text, fontSize: '14px' }}>
            {user?.business_name}
          </span>
          <button
            onClick={logout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
          >
            Выйти
          </button>
        </div>
      </header>

      {/* Основной контент */}
      <div style={{ padding: '40px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ 
            color: COLORS.text,
            marginBottom: '20px',
            fontSize: '32px'
          }}>
            Добро пожаловать, {user?.business_name}!
          </h2>
          <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6' }}>
            Вы успешно вошли в систему лояльности "Апельсинчик".
          </p>
        </div>
      </div>
    </div>
  )
}

// ========================================
// Защищённый роут
// ========================================

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background
      }}>
        <div style={{
          fontSize: '18px',
          color: COLORS.text
        }}>
          Загрузка...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// ========================================
// Основное приложение
// ========================================

function App() {
  const { checkAuth } = useAuth()

  useEffect(() => {
    // Проверяем аутентификацию при загрузке приложения
    checkAuth()
  }, [checkAuth])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Защищённые маршруты */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Редирект с / на /dashboard если авторизован */}
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated() ? '/dashboard' : '/'} replace />} 
        />
      </Routes>
    </Router>
  )
}

export default App
