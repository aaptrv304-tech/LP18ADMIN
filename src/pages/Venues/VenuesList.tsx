import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api'
import VenueCard from './VenueCard'
import { COLORS } from '../Landing'

interface Venue {
  id: number
  name: string
  address: string
  description?: string
  image_url?: string
  visits_count?: number
  created_at: string
}

export default function VenuesList() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchVenues()
  }, [])

  const fetchVenues = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getVenues()
      setVenues(response.data)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching venues:', err)
      setError(err.response?.data?.message || 'Ошибка загрузки заведений')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (venue: Venue) => {
    try {
      await adminApi.deleteVenue(venue.id)
      setVenues(venues.filter(v => v.id !== venue.id))
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка удаления заведения')
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
          Загрузка заведений...
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

  if (venues.length === 0) {
    return (
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '40px',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '60px', marginBottom: '20px', color: COLORS.primary + '40' }}>
          🏪
        </div>
        <h3 style={{ fontSize: '20px', color: COLORS.text, marginBottom: '10px' }}>
          У вас пока нет заведений
        </h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Добавьте первое заведение, чтобы начать работу
        </p>
        <button
          onClick={() => alert('Функция добавления заведения будет добавлена')}
          style={{
            padding: '12px 32px',
            backgroundColor: COLORS.primary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '15px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryDark}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
        >
          ➕ Добавить заведение
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{
        fontSize: '24px',
        color: COLORS.text,
        marginBottom: '24px',
        fontWeight: '600'
      }}>
        🏪 Мои заведения
      </h2>

      <p style={{
        color: '#666',
        marginBottom: '24px',
        fontSize: '14px'
      }}>
        Всего заведений: <strong>{venues.length}</strong>
      </p>

      {/* Список заведений */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {venues.map((venue) => (
          <VenueCard
            key={venue.id}
            venue={venue}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}
