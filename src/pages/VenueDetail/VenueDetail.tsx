import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { adminApi } from '../../services/api'
import { COLORS } from '../Landing'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStore, 
  faMapMarkerAlt, 
  faPhone, 
  faCalendar, 
  faUsers, 
  faArrowLeft,
  faChartLine
} from '@fortawesome/free-solid-svg-icons'
import VisitList from './VisitList'
import VisitsChart from './VisitsChart'
import TopVisitors from './TopVisitors'

interface Venue {
  id: number
  name: string
  address: string
  description?: string
  category?: string
  phone?: string
  visits_count?: number
  created_at: string
  is_active: boolean
}

export default function VenueDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [venue, setVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchVenue(Number(id))
    }
  }, [id])

  const fetchVenue = async (venueId: number) => {
    try {
      setLoading(true)
      const response = await adminApi.getVenueById(venueId)
      setVenue(response.data)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching venue:', err)
      setError(err.response?.data?.message || 'Ошибка загрузки заведения')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/venues')
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
          Загрузка заведения...
        </div>
      </div>
    )
  }

  if (error || !venue) {
    return (
      <div style={{
        backgroundColor: COLORS.error + '15',
        color: COLORS.error,
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: `1px solid ${COLORS.error}`
      }}>
        {error || 'Заведение не найдено'}
      </div>
    )
  }

  // Статистика для примера (в реальности нужно получать с бэкенда)
  const stats = {
    today: Math.floor(Math.random() * 20),
    week: Math.floor(Math.random() * 80),
    month: Math.floor(Math.random() * 250)
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Кнопка назад */}
      <button
        onClick={handleBack}
        style={{
          marginBottom: '32px',
          padding: '12px 24px',
          backgroundColor: '#f5f5f5',
          color: '#333',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>Назад к списку заведений</span>
      </button>

      {/* Заголовок */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: COLORS.primary + '15',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: COLORS.primary
          }}>
            <FontAwesomeIcon icon={faStore} />
          </div>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: COLORS.text,
              margin: 0,
              marginBottom: '4px'
            }}>
              {venue.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#666', fontSize: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span>{venue.address || 'Адрес не указан'}</span>
              </span>
              {venue.phone && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FontAwesomeIcon icon={faPhone} />
                  <span>{venue.phone}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: COLORS.text,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FontAwesomeIcon icon={faChartLine} />
          <span>Статистика</span>
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          <StatCard 
            title="Посещений сегодня" 
            value={stats.today} 
            icon={faCalendar} 
            color="#2196F3"
            bgColor="rgba(33, 150, 243, 0.1)"
          />
          <StatCard 
            title="Посещений за неделю" 
            value={stats.week} 
            icon={faCalendar} 
            color="#FF9800"
            bgColor="rgba(255, 152, 0, 0.1)"
          />
          <StatCard 
            title="Посещений за месяц" 
            value={stats.month} 
            icon={faCalendar} 
            color="#9C27B0"
            bgColor="rgba(156, 39, 176, 0.1)"
          />
          <StatCard 
            title="Всего посещений" 
            value={venue.visits_count || 0} 
            icon={faUsers} 
            color="#4CAF50"
            bgColor="rgba(76, 175, 80, 0.1)"
          />
        </div>
      </div>

      {/* Информация о заведении */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: COLORS.text,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FontAwesomeIcon icon={faStore} />
          <span>Информация о заведении</span>
        </h2>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: `1px solid ${COLORS.border}`,
          padding: '24px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <InfoItem 
              label="ID заведения" 
              value={`#${venue.id}`} 
              icon={faCalendar}
            />
            <InfoItem 
              label="Категория" 
              value={venue.category || 'Не указана'} 
              icon={faStore}
            />
            <InfoItem 
              label="Дата создания" 
              value={new Date(venue.created_at).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} 
              icon={faCalendar}
            />
          </div>

          {/* Описание */}
          {venue.description && (
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${COLORS.border}` }}>
              <div style={{ 
                fontSize: '13px', 
                color: '#999', 
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '600'
              }}>
                Описание
              </div>
              <div style={{ 
                fontSize: '15px', 
                color: '#666',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {venue.description}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Топ-5 посетителей */}
      {venue.visits_count && venue.visits_count > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <TopVisitors businessId={venue.id} />
        </div>
      )}

      {/* График посещений */}
      {venue.visits_count && venue.visits_count > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <VisitsChart businessId={venue.id} totalVisits={venue.visits_count} />
        </div>
      )}

      {/* Последние посещения */}
      <div>
        <VisitList businessId={venue.id} />
      </div>
    </div>
  )
}

// Компонент карточки статистики
function StatCard({ title, value, icon, color, bgColor }: { title: string, value: number | string, icon: any, color: string, bgColor: string }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      border: `1px solid ${COLORS.border}`,
      transition: 'all 0.3s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'
      e.currentTarget.style.transform = 'translateY(-4px)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none'
      e.currentTarget.style.transform = 'translateY(0)'
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '13px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            {title}
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.text, lineHeight: '1.2' }}>
            {value}
          </div>
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: bgColor,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          color: color
        }}>
          <FontAwesomeIcon icon={icon} />
        </div>
      </div>
    </div>
  )
}

// Компонент элемента информации
function InfoItem({ label, value, icon }: { label: string, value: string, icon: any }) {
  return (
    <div>
      <div style={{ 
        fontSize: '12px', 
        color: '#999', 
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <FontAwesomeIcon icon={icon} size="xs" />
        <span>{label}</span>
      </div>
      <div style={{ 
        fontSize: '16px', 
        fontWeight: '600',
        color: COLORS.text,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {value}
      </div>
    </div>
  )
}
