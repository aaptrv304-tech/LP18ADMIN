import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faFilter, faDownload, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { COLORS } from '../../pages/Landing'

export default function VenuesFilters() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px'
    }}>
      {/* Поиск */}
      <div style={{ position: 'relative', width: '400px' }}>
        <div style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#999'
        }}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
        <input
          type="text"
          placeholder="Поиск по названию, адресу..."
          style={{
            width: '100%',
            paddingLeft: '48px',
            paddingRight: '16px',
            paddingTop: '12px',
            paddingBottom: '12px',
            border: `1px solid ${COLORS.border}`,
            borderRadius: '12px',
            fontSize: '14px',
            color: COLORS.text,
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = COLORS.primary}
          onBlur={(e) => e.currentTarget.style.borderColor = COLORS.border}
        />
      </div>

      {/* Кнопки действий */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 20px',
          border: `1px solid ${COLORS.border}`,
          borderRadius: '12px',
          backgroundColor: 'white',
          color: '#666',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f5f5f5'
          e.currentTarget.style.borderColor = '#ccc'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'white'
          e.currentTarget.style.borderColor = COLORS.border
        }}
        >
          <FontAwesomeIcon icon={faFilter} />
          <span>Фильтры</span>
        </button>

        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 20px',
          border: `1px solid ${COLORS.border}`,
          borderRadius: '12px',
          backgroundColor: 'white',
          color: '#666',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f5f5f5'
          e.currentTarget.style.borderColor = '#ccc'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'white'
          e.currentTarget.style.borderColor = COLORS.border
        }}
        >
          <FontAwesomeIcon icon={faDownload} />
          <span>Экспорт в CSV</span>
        </button>

        <div style={{ position: 'relative' }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            border: `1px solid ${COLORS.border}`,
            borderRadius: '12px',
            backgroundColor: 'white',
            color: '#666',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5'
            e.currentTarget.style.borderColor = '#ccc'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white'
            e.currentTarget.style.borderColor = COLORS.border
          }}
          >
            <span>Сортировка: По дате</span>
            <FontAwesomeIcon icon={faChevronDown} size="xs" />
          </button>
        </div>
      </div>
    </div>
  )
}
