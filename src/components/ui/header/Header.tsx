import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faCircleQuestion } from '@fortawesome/free-regular-svg-icons'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { COLORS } from '../../../pages/Landing'

interface HeaderProps {
  title: string
  breadcrumb?: string[]
}

export default function Header({ title, breadcrumb = [] }: HeaderProps) {
  return (
    <header style={{
      backgroundColor: 'white',
      borderBottom: `1px solid ${COLORS.border}`,
      padding: '24px 48px',
      position: 'fixed',
      top: 0,
      right: 0,
      left: '280px', // Начинается сразу после сайдбара
      zIndex: 100,
      width: 'calc(100% - 280px)' // Растягиваем на всю оставшуюся ширину
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {/* Хлебные крошки */}
          {breadcrumb.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#999'
            }}>
              {breadcrumb.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{item}</span>
                  {index < breadcrumb.length - 1 && (
                    <FontAwesomeIcon icon={faChevronRight} size="xs" />
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Заголовок */}
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: COLORS.text,
            margin: 0
          }}>
            {title}
          </h1>
        </div>

        {/* Кнопки */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            style={{
              padding: '10px 16px',
              backgroundColor: '#f5f5f5',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              color: '#666',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
          >
            <FontAwesomeIcon icon={faBell} size="lg" />
          </button>
          <button
            style={{
              padding: '10px 16px',
              backgroundColor: '#f5f5f5',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              color: '#666',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
          >
            <FontAwesomeIcon icon={faCircleQuestion} size="lg" />
          </button>
        </div>
      </div>
    </header>
  )
}
