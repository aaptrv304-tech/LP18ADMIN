import { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import DashboardStats from './DashboardStats'

export default function Dashboard() {
  const { user } = useAuth()

  useEffect(() => {
    console.log('🚀 Dashboard component rendered')
    console.log('👤 Current user:', user)
  }, [user])

  if (!user) {
    return <div>Загрузка данных пользователя...</div>
  }

  return (
    <div style={{ padding: '0' }}>
      <DashboardStats />
    </div>
  )
}
