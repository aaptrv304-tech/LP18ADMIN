import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../../hooks/useAuth'
import { COLORS } from '../../pages/Landing'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background
      }}>
        <div style={{ fontSize: '18px', color: COLORS.text }}>
          Загрузка профиля...
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Сайдбар */}
      <Sidebar 
        businessName={user.business_name} 
        onLogout={logout} 
      />
      
      {/* Основной контент */}
      <div style={{ flex: 1, marginLeft: '260px' }}>
        {/* Контент страницы */}
        <div style={{ padding: '40px', backgroundColor: COLORS.lightGray }}>
          {children ? children : <Outlet />}
        </div>
      </div>
    </div>
  )
}
