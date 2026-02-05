import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChartLine, 
  faStore, 
  faUsers, 
  faChartBar, 
  faCog 
} from '@fortawesome/free-solid-svg-icons'
import { COLORS } from '../../../pages/Landing'

interface SidebarProps {
  businessName: string
  onLogout: () => void
}

export default function Sidebar({ businessName, onLogout }: SidebarProps) {
  const menuItems = [
    { path: '/dashboard', label: 'Статистика', icon: faChartLine },
    { path: '/venues', label: 'Заведения', icon: faStore },
    { path: '/users', label: 'Пользователи', icon: faUsers },
    { path: '/analytics', label: 'Аналитика', icon: faChartBar },
    { path: '/settings', label: 'Настройки', icon: faCog },
  ]

  return (
    <aside style={{
      width: '280px',
      backgroundColor: 'white',
      borderRight: `1px solid ${COLORS.border}`,
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      boxShadow: '2px 0 10px rgba(0,0,0,0.05)'
    }}>
      {/* Логотип и название */}
      <div style={{
        padding: '32px 24px',
        borderBottom: `1px solid ${COLORS.border}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(to bottom right, #ff8c42, #ff6b35)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'rotate(12deg)',
            boxShadow: '0 4px 12px rgba(255, 140, 66, 0.3)'
          }}>
            <FontAwesomeIcon 
              icon={faChartLine} 
              color="white" 
              size="lg" 
              style={{ transform: 'rotate(-12deg)' }}
            />
          </div>
          <div>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: COLORS.text,
              margin: 0
            }}>
              Апельсинчик
            </h1>
          </div>
        </div>
      </div>

      {/* Навигация */}
      <nav style={{ flex: 1, padding: '24px 16px' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: isActive ? 'rgba(255, 140, 66, 0.1)' : 'transparent',
                  color: isActive ? COLORS.primary : '#666',
                  textDecoration: 'none',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                })}
              >
                <FontAwesomeIcon icon={item.icon} size="lg" width={24} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Футер с профилем */}
      <div style={{
        padding: '24px 16px',
        borderTop: `1px solid ${COLORS.border}`,
        backgroundColor: '#fafafa'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '12px',
          backgroundColor: '#f5f5f5'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: COLORS.primary,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            {businessName.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: COLORS.text,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {businessName}
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              padding: '8px 12px',
              backgroundColor: COLORS.primary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '13px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryDark}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
          >
            Выйти
          </button>
        </div>
      </div>
    </aside>
  )
}
