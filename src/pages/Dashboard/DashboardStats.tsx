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
      color: '#FF8C42',
      bgColor: 'rgba(255, 140, 66, 0.1)',
      change: '+12%',
      changeColor: '#28a745'
    },
    {
      title: 'Всего посещений',
      value: stats.total_visits,
      icon: '👥',
      color: '#4CAF50',
      bgColor: 'rgba(76, 175, 80, 0.1)',
      change: '+8%',
      changeColor: '#28a745'
    },
    {
      title: 'Посещений сегодня',
      value: stats.visits_today,
      icon: '📅',
      color: '#2196F3',
      bgColor: 'rgba(33, 150, 243, 0.1)',
      change: '+5%',
      changeColor: '#28a745'
    },
    {
      title: 'Посещений за неделю',
      value: stats.visits_this_week,
      icon: '📆',
      color: '#FF9800',
      bgColor: 'rgba(255, 152, 0, 0.1)',
      change: '+15%',
      changeColor: '#28a745'
    },
    {
      title: 'Посещений за месяц',
      value: stats.visits_this_month,
      icon: '🗓️',
      color: '#9C27B0',
      bgColor: 'rgba(156, 39, 176, 0.1)',
      change: '+22%',
      changeColor: '#28a745'
    },
  ]

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Карточки статистики */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {statCards.map((card) => (
          <div key={card.title} style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            border: `1px solid ${COLORS.border}`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'
          }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#999', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                  {card.title}
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.text, lineHeight: '1.2' }}>
                  {card.value}
                </div>
              </div>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: card.bgColor,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                color: card.color
              }}>
                {card.icon}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: card.changeColor
              }} />
              <span style={{ fontSize: '13px', color: '#666' }}>
                <span style={{ color: card.changeColor, fontWeight: '600' }}>{card.change}</span> за период
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Кнопка обновления под карточками */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-start' 
      }}>
        <button
          onClick={fetchStats}
          style={{
            padding: '10px 20px',
            backgroundColor: COLORS.primary,
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(255, 140, 66, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.primaryDark
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 140, 66, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.primary
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 140, 66, 0.2)'
          }}
        >
          <span>🔄</span>
          <span>Обновить данные</span>
        </button>
      </div>
    </div>
  )
}
