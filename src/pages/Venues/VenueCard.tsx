import { COLORS } from '../Landing'
import { useNavigate } from 'react-router-dom'

interface VenueCardProps {
  venue: {
    id: number
    name: string
    address: string
    description?: string
    image_url?: string
    visits_count?: number
    created_at: string
  }
}

export default function VenueCard({ venue }: VenueCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/venues/${venue.id}`)
  }

  return (
    <div 
      onClick={handleClick}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'
      }}
    >
      {/* Название */}
      <h3 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: '8px'
      }}>
        {venue.name}
      </h3>

      {/* Адрес */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px',
        color: '#666',
        fontSize: '14px'
      }}>
        <span style={{ marginRight: '6px' }}>📍</span>
        <span>{venue.address}</span>
      </div>

      {/* Описание */}
      {venue.description && (
        <p style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: '16px',
          lineHeight: '1.5'
        }}>
          {venue.description}
        </p>
      )}

      {/* Статистика */}
      <div style={{
        borderTop: `1px solid ${COLORS.border}`,
        paddingTop: '16px',
        fontSize: '14px',
        color: '#666',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>👥</span>
          <span style={{ fontWeight: '600' }}>{venue.visits_count || 0}</span>
          <span>посещений</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>📅</span>
          <span>{new Date(venue.created_at).toLocaleDateString('ru-RU')}</span>
          <span>создано</span>
        </div>
      </div>
    </div>
  )
}
