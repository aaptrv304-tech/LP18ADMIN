import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api'
import { COLORS } from '../../pages/Landing'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faUser, faCalendar } from '@fortawesome/free-solid-svg-icons'

interface Visitor {
  user_id: string
  telegram_id: string
  username: string
  first_name: string
  last_name: string
  phone: string
  visit_count: number
}

export default function TopVisitors({ businessId }: { businessId: number }) {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTopVisitors()
  }, [businessId])

  const fetchTopVisitors = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getTopVisitors(businessId, 5)
      const data = response.data.visitors || []
      setVisitors(data)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching top visitors:', err)
      setError(err.response?.data?.message || 'Ошибка загрузки топа посетителей')
      setVisitors([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        border: `1px solid ${COLORS.border}`,
        padding: '32px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>👑</div>
        <p style={{ color: '#999', fontSize: '14px' }}>Загрузка топа посетителей...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '16px',
        padding: '24px',
        color: '#856404',
        fontSize: '14px'
      }}>
        {error}
      </div>
    )
  }

  if (visitors.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        border: `1px solid ${COLORS.border}`,
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#FFD70020',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <FontAwesomeIcon icon={faCrown} style={{ fontSize: '48px', color: '#FFD700' }} />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text, marginBottom: '8px' }}>
          Нет данных для топа
        </h3>
        <p style={{ color: '#999', fontSize: '14px', lineHeight: '1.5' }}>
          Топ посетителей появится после первых визитов клиентов
        </p>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      border: `1px solid ${COLORS.border}`,
      padding: '32px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#FFD70020',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          color: '#FFD700'
        }}>
          <FontAwesomeIcon icon={faCrown} />
        </div>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: COLORS.text,
          margin: 0
        }}>
          Топ-5 посетителей
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {visitors.map((visitor, index) => (
          <VisitorCard key={visitor.user_id} visitor={visitor} rank={index + 1} />
        ))}
      </div>
    </div>
  )
}

function VisitorCard({ visitor, rank }: { visitor: Visitor, rank: number }) {
  const getRankBadge = (rank: number) => {
    const colors = ['#FFD700', '#C0C0C0', '#CD7F32'] // Золото, серебро, бронза
    if (rank <= 3) {
      return (
        <div style={{
          width: '32px',
          height: '32px',
          backgroundColor: colors[rank - 1] + '20',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
          color: colors[rank - 1],
          flexShrink: 0
        }}>
          {rank}
        </div>
      )
    }
    return (
      <div style={{
        width: '32px',
        height: '32px',
        backgroundColor: '#f5f5f5',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#666',
        flexShrink: 0
      }}>
        {rank}
      </div>
    )
  }

  const getUserName = () => {
    if (visitor.first_name || visitor.last_name) {
      return `${visitor.first_name} ${visitor.last_name}`.trim()
    }
    if (visitor.username) {
      return `@${visitor.username}`
    }
    return 'Анонимный пользователь'
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      backgroundColor: rank <= 3 ? 'rgba(255, 215, 0, 0.05)' : 'transparent',
      borderRadius: '12px',
      border: rank <= 3 ? `1px solid ${['#FFD700', '#C0C0C0', '#CD7F32'][rank - 1]}30` : `1px solid ${COLORS.border}`,
      transition: 'all 0.2s'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = rank <= 3 ? 'rgba(255, 215, 0, 0.1)' : '#f9fafb'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = rank <= 3 ? 'rgba(255, 215, 0, 0.05)' : 'transparent'
      }}
    >
      {getRankBadge(rank)}

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: COLORS.text }}>
            {getUserName()}
          </div>
          {visitor.phone && (
            <div style={{ fontSize: '13px', color: '#666' }}>
              📞 {visitor.phone}
            </div>
          )}
          {visitor.telegram_id && (
            <div style={{ fontSize: '13px', color: '#666' }}>
              💬 @{visitor.telegram_id}
            </div>
          )}
        </div>
      </div>

      <div style={{
        padding: '8px 16px',
        backgroundColor: 'rgba(255, 140, 66, 0.1)',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '600',
        color: COLORS.primary,
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <FontAwesomeIcon icon={faCalendar} />
        <span>{visitor.visit_count} посещений</span>
      </div>
    </div>
  )
}
