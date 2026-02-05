import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStore, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { COLORS } from '../../pages/Landing'

interface Stats {
  total: number
  active: number
}

export default function VenuesStats({ stats }: { stats: Stats }) {
  const statCards = [
    {
      title: 'Всего заведений',
      value: stats.total,
      icon: faStore,
      color: '#3B82F6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Активные',
      value: stats.active,
      icon: faCheckCircle,
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '24px',
      marginBottom: '32px'
    }}>
      {statCards.map((card) => (
        <div key={card.title} style={{
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
              <div style={{ fontSize: '12px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                {card.title}
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.text, lineHeight: '1.2' }}>
                {card.value}
              </div>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: card.bgColor,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: card.color
            }}>
              <FontAwesomeIcon icon={card.icon} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
