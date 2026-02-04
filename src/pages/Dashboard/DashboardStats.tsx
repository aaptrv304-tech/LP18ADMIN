import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api'
import { COLORS } from '../Landing'

interface Stats {
  total_users: number
  total_venues: number
  total_visits: number
  visits_today: number
  visits_this_week: number
  visits_this_month: number
  active_users: number
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('📊 DashboardStats mounted - fetching stats...')
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      console.log('📡 Sending request to /api/admin/stats')
      
      const response = await adminApi.getStats()
      
      console.log('✅ Stats response:', response.data)
      setStats(response.data)
      setError(null)
    } catch (err: any) {
      console.error('❌ Error fetching stats:', err)
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      })
      setError(err.response?.data?.message || 'Ошибка загрузки статистики')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px'
      }}>
        <div style={{ fontSize: '18px', color: COLORS.text }}>
          Загрузка статистики...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: COLORS.error + '15',
        color: COLORS.error,
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: `1px solid ${COLORS.error}`
      }}>
        {error}
      </div>
    )
  }

  if (!stats) {
    return (
      <div style={{
        backgroundColor: '#ffc10715',
        color: COLORS.text,
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: `1px solid ${COLORS.border}`
      }}>
        Нет данных для отображения
      </div>
    )
  }

  const statCards = [
    {
      title: 'Всего заведений',
      value: stats.total_venues,
      icon: '🏪',
      color: COLORS.primary
    },
    {
      title: 'Всего посещений',
      value: stats.total_visits,
      icon: '👥',
      color: '#4CAF50'
    },
    {
      title: 'Посещений сегодня',
      value: stats.visits_today,
      icon: '📅',
      color: '#2196F3'
    },
    {
      title: 'Посещений за неделю',
      value: stats.visits_this_week,
      icon: '📆',
      color: '#FF9800'
    },
    {
      title: 'Посещений за месяц',
      value: stats.visits_this_month,
      icon: '🗓️',
      color: '#9C27B0'
    },
    {
      title: 'Активные пользователи',
      value: stats.active_users,
      icon: '⭐',
      color: '#E91E63'
    },
  ]

  return (
    <div>
      {/* Карточки статистики */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '30px'
      }}>
        {statCards.map((card) => (
          <div key={card.title} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px 28px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)'
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.12)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'
          }}
          >
            <div style={{
              fontSize: '40px',
              marginBottom: '16px',
              color: card.color
            }}>
              {card.icon}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '10px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {card.title}
            </div>
            <div style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: COLORS.text,
              lineHeight: '1.2'
            }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Кнопка обновления */}
      <button
        onClick={fetchStats}
        style={{
          padding: '12px 32px',
          backgroundColor: COLORS.primary,
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '15px',
          transition: 'all 0.3s',
          boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = COLORS.primaryDark
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 107, 53, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = COLORS.primary
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)'
        }}
      >
        🔄 Обновить данные
      </button>
    </div>
  )
}
