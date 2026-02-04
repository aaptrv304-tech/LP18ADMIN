import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { adminApi } from '../../services/api'
import { COLORS } from '../Landing'

interface Venue {
  id: number
  name: string
  address: string
  description?: string
  category?: string
  phone?: string
  visits_count?: number
  created_at: string
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

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Кнопка назад */}
      <button
        onClick={handleBack}
        style={{
          marginBottom: '24px',
          padding: '10px 20px',
          backgroundColor: '#f0f0f0',
          color: '#333',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '14px',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
      >
        ← Назад к списку заведений
      </button>

      {/* Карточка заведения */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        {/* Иконка и название */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '24px',
          gap: '16px'
        }}>
          <div style={{
            fontSize: '48px',
            color: COLORS.primary
          }}>
            🏪
          </div>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: COLORS.text,
              margin: 0,
              marginBottom: '4px'
            }}>
              {venue.name}
            </h1>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
              ID: #{venue.id}
            </p>
          </div>
        </div>

        {/* Информация о заведении */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Адрес */}
          <div>
            <div style={{ 
              fontSize: '12px', 
              color: '#999', 
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '600'
            }}>
              Адрес
            </div>
            <div style={{ 
              fontSize: '16px', 
              color: COLORS.text,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>📍</span>
              <span>{venue.address || 'Не указан'}</span>
            </div>
          </div>

          {/* Категория */}
          {venue.category && (
            <div>
              <div style={{ 
                fontSize: '12px', 
                color: '#999', 
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '600'
              }}>
                Категория
              </div>
              <div style={{ fontSize: '16px', color: COLORS.text }}>
                {venue.category}
              </div>
            </div>
          )}

          {/* Телефон */}
          {venue.phone && (
            <div>
              <div style={{ 
                fontSize: '12px', 
                color: '#999', 
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '600'
              }}>
                Телефон
              </div>
              <div style={{ 
                fontSize: '16px', 
                color: COLORS.text,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>📱</span>
                <span>{venue.phone}</span>
              </div>
            </div>
          )}

          {/* Дата создания */}
          <div>
            <div style={{ 
              fontSize: '12px', 
              color: '#999', 
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '600'
            }}>
              Создано
            </div>
            <div style={{ 
              fontSize: '16px', 
              color: COLORS.text,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>📅</span>
              <span>{new Date(venue.created_at).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>

          {/* Посещения */}
          <div>
            <div style={{ 
              fontSize: '12px', 
              color: '#999', 
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '600'
            }}>
              Посещений
            </div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold',
              color: COLORS.primary,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>👥</span>
              <span>{venue.visits_count || 0}</span>
            </div>
          </div>
        </div>

        {/* Описание */}
        {venue.description && (
          <div style={{ marginTop: '24px' }}>
            <div style={{ 
              fontSize: '12px', 
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
  )
}
