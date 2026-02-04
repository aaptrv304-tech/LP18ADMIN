import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { COLORS } from './Landing'

export default function Login() {
  const navigate = useNavigate()
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
      // Редирект на дашборд после успешного входа
      setTimeout(() => {
        navigate('/dashboard')
      }, 500)
    } catch (err: any) {
      console.error('Login error:', err)
      if (err.response) {
        setError(err.response.data.message || 'Ошибка авторизации')
      } else if (err.request) {
        setError('Не удалось подключиться к серверу')
      } else {
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
