import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStore, 
  faMapMarkerAlt, 
  faCalendar, 
  faEllipsisVertical
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '../../pages/Landing'

interface Venue {
  id: number
  name: string
  address: string
  category: string
  phone: string
  visits_count: number
  created_at: string
  is_active: boolean
}

export default function VenuesTable({ venues }: { venues: Venue[] }) {
  const navigate = useNavigate()

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: '#10B981'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#10B981'
          }}></span>
          Активно
        </span>
      )
    }
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        color: '#6B7280'
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#6B7280'
        }}></span>
        Неактивно
      </span>
    )
  }

  const handleRowClick = (venueId: number) => {
    navigate(`/venues/${venueId}`)
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      border: `1px solid ${COLORS.border}`,
      overflow: 'hidden'
    }}>
      {/* Таблица */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: `1px solid ${COLORS.border}` }}>
              <th style={{
                padding: '16px 32px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Заведение
              </th>
              <th style={{
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Адрес
              </th>
              <th style={{
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Категория
              </th>
              <th style={{
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Посещения
              </th>
              <th style={{
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Дата создания
              </th>
              <th style={{
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Статус
              </th>
              <th style={{
                padding: '16px 24px',
                textAlign: 'right',
                fontSize: '12px',
                fontWeight: '600',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {venues.map((venue, index) => (
              <tr
                key={venue.id}
                style={{
                  backgroundColor: index % 2 === 0 ? 'white' : '#fafafa',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 140, 66, 0.1)'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#fafafa'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
                onClick={() => handleRowClick(venue.id)}
              >
                <td style={{ padding: '20px 32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: COLORS.primary + '10',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      color: COLORS.primary
                    }}>
                      <FontAwesomeIcon icon={faStore} />
                    </div>
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: COLORS.text,
                        marginBottom: '4px'
                      }}>
                        {venue.name}
                      </div>
                      {venue.phone && (
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          📞 {venue.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#666' }}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} size="sm" />
                    <span>{venue.address || 'Не указан'}</span>
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {venue.category || '—'}
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '600', color: COLORS.text }}>
                    <FontAwesomeIcon icon={faCalendar} size="lg" />
                    <span>{venue.visits_count || 0} визитов</span>
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {new Date(venue.created_at).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  {getStatusBadge(venue.is_active !== false)}
                </td>
                <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                  <button 
                    style={{
                      padding: '8px',
                      border: 'none',
                      background: 'none',
                      color: '#999',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={(e) => {
                      e.stopPropagation()
                      // Здесь можно добавить меню действий
                      alert('Меню действий будет добавлено позже')
                    }}
                  >
                    <FontAwesomeIcon icon={faEllipsisVertical} size="lg" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
