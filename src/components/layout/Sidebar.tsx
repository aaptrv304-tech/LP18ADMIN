import { NavLink } from 'react-router-dom'
import { COLORS } from '../../pages/Landing'

interface SidebarProps {
  businessName: string
  onLogout: () => void
}

export default function Sidebar({ businessName, onLogout }: SidebarProps) {
  const menuItems = [
    { path: '/dashboard', label: 'Статистика', icon: '📊' },
    { path: '/venues', label: 'Заведения', icon: '🏪' },
    { path: '/users', label: 'Пользователи', icon: '👥' },
    { path: '/analytics', label: 'Аналитика', icon: '📈' },
    { path: '/settings', label: 'Настройки', icon: '⚙️' },
  ]

  return (
    <div style={{
      width: '260px',
      backgroundColor: 'white',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Логотип и название */}
      <div style={{
        padding: '20px',
        borderBottom: `1px solid ${COLORS.border}`,
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '32px',
          marginBottom: '10px',
          color: COLORS.primary
        }}>
          🍊
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: COLORS.text
        }}>
          Апельсинчик
        </div>
        <div style={{
          fontSize: '12px',
          color: '#666',
          marginTop: '5px',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {businessName}
        </div>
      </div>

      {/* Меню */}
      <nav style={{ flex: 1, padding: '20px 0' }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              padding: '15px 20px',
              color: isActive ? COLORS.primary : '#666',
              backgroundColor: isActive ? COLORS.primary + '10' : 'transparent',
              textDecoration: 'none',
              fontWeight: isActive ? '600' : '400',
              transition: 'all 0.2s',
              borderLeft: `3px solid ${isActive ? COLORS.primary : 'transparent'}`,
            })}
          >
            <span style={{ marginRight: '12px', fontSize: '18px' }}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Футер с кнопкой выхода */}
      <div style={{ padding: '15px 20px', borderTop: `1px solid ${COLORS.border}` }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: COLORS.primary,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryDark}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
        >
          Выйти
        </button>
      </div>
    </div>
  )
}
