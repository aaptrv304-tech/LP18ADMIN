import { COLORS } from '../Landing'

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
  onEdit?: (venue: any) => void
  onDelete?: (venue: any) => void
}

export default function VenueCard({ venue, onEdit, onDelete }: VenueCardProps) {
  const handleEdit = () => {
    if (onEdit) onEdit(venue)
  }

  const handleDelete = () => {
    if (onDelete && confirm(`Удалить заведение "${venue.name}"?`)) {
      onDelete(venue)
    }
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      position: 'relative'
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
      {/* Кнопки действий */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={handleEdit}
          style={{
            padding: '8px 12px',
            backgroundColor: COLORS.primary + '15',
            color: COLORS.primary,
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primary + '25'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary + '15'}
        >
          ✏️ Редактировать
        </button>
        <button
          onClick={handleDelete}
          style={{
            padding: '8px 12px',
            backgroundColor: '#dc354515',
            color: '#dc3545',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc354525'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc354515'}
        >
          🗑️ Удалить
        </button>
      </div>

      {/* Изображение заведения */}
      {venue.image_url ? (
        <div style={{
          width: '100%',
          height: '160px',
          borderRadius: '8px',
          marginBottom: '16px',
          overflow: 'hidden',
          backgroundColor: '#f5f5f5'
        }}>
          <img
            src={venue.image_url}
            alt={venue.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      ) : (
        <div style={{
          width: '100%',
          height: '160px',
          borderRadius: '8px',
          marginBottom: '16px',
          backgroundColor: COLORS.primary + '08',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '60px',
          color: COLORS.primary + '40'
        }}>
          🏪
        </div>
      )}

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
        display: 'flex',
        gap: '24px',
        fontSize: '13px',
        color: '#666'
      }}>
        <div>
          <div style={{ fontWeight: '600', color: COLORS.text }}>👥</div>
          <div>{venue.visits_count || 0}</div>
          <div style={{ fontSize: '11px', marginTop: '2px' }}>посещений</div>
        </div>
        <div>
          <div style={{ fontWeight: '600', color: COLORS.text }}>📅</div>
          <div>{new Date(venue.created_at).toLocaleDateString('ru-RU')}</div>
          <div style={{ fontSize: '11px', marginTop: '2px' }}>создано</div>
        </div>
      </div>
    </div>
  )
}
