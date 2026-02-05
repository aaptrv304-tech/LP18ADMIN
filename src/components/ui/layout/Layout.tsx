import { Outlet } from 'react-router-dom'
import { ReactNode } from 'react'
import Sidebar from '../sidebar/Sidebar'
import Header from '../header/Header'
import { useAuth } from '../../../hooks/useAuth'

interface LayoutProps {
  title?: string
  breadcrumb?: string[]
  children?: ReactNode
}

export default function Layout({ title, breadcrumb = [], children }: LayoutProps) {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Сайдбар */}
      <Sidebar 
        businessName={user.business_name} 
        onLogout={logout} 
      />
      
      {/* Основной контент */}
      <div style={{ 
        flex: 1, 
        marginLeft: '280px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Хедер (показываем только если есть заголовок) */}
        {title && (
          <Header title={title} breadcrumb={breadcrumb} />
        )}
        
        {/* Контент страницы */}
        <div style={{ 
          padding: title ? '96px 48px 48px' : '48px 48px 48px',
          minHeight: 'calc(100vh - 96px)',
          flex: 1
        }}>
          {children ? children : <Outlet />}
        </div>
      </div>
    </div>
  )
}
