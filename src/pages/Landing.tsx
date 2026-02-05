import { useNavigate } from 'react-router-dom'

// Цвета бренда "Апельсинчик"
export const COLORS = {
  primary: '#FF8C42',        // Оранжевый (как в примере)
  primaryDark: '#FF6B35',    // Тёмно-оранжевый
  secondary: '#F8F9FA',      // Светло-серый фон
  background: '#fffaf0',     // Кремовый фон
  text: '#333333',           // Тёмный текст
  lightGray: '#f5f5f5',      // Светло-серый
  border: '#e0e0e0',         // Серая граница
  success: '#28a745',
  error: '#dc3545',
}

export default function Landing() {
  const navigate = useNavigate()

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
          onClick={() => navigate('/login')}
          style={{ 
            marginTop: '20px', 
            padding: '14px 40px', 
            backgroundColor: COLORS.primary,
            color: 'white', 
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(255, 140, 66, 0.3)',
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
