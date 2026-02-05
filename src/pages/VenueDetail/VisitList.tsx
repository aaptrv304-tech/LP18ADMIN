import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api'
import { COLORS } from '../../pages/Landing'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faUser, faAward, faClock } from '@fortawesome/free-solid-svg-icons'

interface Visit {
  id: string
  user_id: string
  user_name: string
  user_phone: string
  telegram_id: string
  points_earned: number
  created_at: string
}

export default function VisitList({ businessId }: { businessId: number }) {
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchVisits()
  }, [businessId])

  const fetchVisits = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getVisitsByBusiness(businessId, 50)
      
      // Нормализуем данные: если ответ не массив, используем пустой массив
      const data = Array.isArray(response.data) ? response.data : []
      setVisits(data)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching visits:', err)
      setError(err.response?.data?.message || 'Ошибка загрузки посещений')
      setVisits([]) // Устанавливаем пустой массив при ошибке
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#999'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <p>Загрузка посещений...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '8px',
        padding: '16px',
        color: '#856404',
        fontSize: '14px'
      }}>
        {error}
      </div>
    )
  }

  // Безопасная проверка на пустой массив
  if (!visits || visits.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#999'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
        <p style={{ fontSize: '16px', marginBottom: '8px' }}>Нет посещений</p>
        <p style={{ fontSize: '14px' }}>Посещения появятся после того, как клиенты начнут пользоваться системой</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '16px 24px',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        border: `1px solid ${COLORS.border}`
      }}>
        <div>
          <div style={{ fontSize: '12px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Последние посещения
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.text }}>
            {visits.length} посещений
          </div>
        </div>
        <button
          onClick={fetchVisits}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f5f5f5',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            color: '#666',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
        >
          <FontAwesomeIcon icon={faClock} style={{ marginRight: '6px' }} />
          Обновить
        </button>
      </div>

      <div style={{
        display: 'grid',
        gap: '12px'
      }}>
        {visits.map((visit) => (
          <VisitCard key={visit.id} visit={visit} />
        ))}
      </div>
    </div>
  )
}

function VisitCard({ visit }: { visit: Visit }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      border: `1px solid ${COLORS.border}`,
      transition: 'all 0.2s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
      e.currentTarget.style.transform = 'translateX(4px)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none'
      e.currentTarget.style.transform = 'translateX(0)'
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#f5f5f5',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: '#666'
          }}>
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: COLORS.text, marginBottom: '2px' }}>
              {visit.user_name}
            </div>
            {visit.user_phone && (
              <div style={{ fontSize: '13px', color: '#666' }}>
                📞 {visit.user_phone}
              </div>
            )}
            {visit.telegram_id && (
              <div style={{ fontSize: '13px', color: '#666' }}>
                💬 @{visit.telegram_id}
              </div>
            )}
          </div>
        </div>
        <div style={{
          padding: '6px 12px',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '600',
          color: '#4CAF50',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <FontAwesomeIcon icon={faAward} />
          <span>+{visit.points_earned}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#666' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <FontAwesomeIcon icon={faCalendar} size="sm" />
          <span>
            {new Date(visit.created_at).toLocaleDateString('ru-RU', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#e0e0e0' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <FontAwesomeIcon icon={faUser} size="sm" />
          <span>ID: {visit.user_id.substring(0, 8)}...</span>
        </div>
      </div>
    </div>
  )
}
