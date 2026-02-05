import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api'
import VenuesStats from './VenuesStats'
import VenuesTable from './VenuesTable'
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

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchVenues()
  }, [])

  const fetchVenues = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getVenues()
      setVenues(response.data)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching venues:', err)
      setError(err.response?.data?.message || 'Ошибка загрузки заведений')
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: venues.length,
    active: venues.filter(v => v.is_active !== false).length
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px'
      }}>
        <div style={{ fontSize: '18px', color: COLORS.text }}>
          Загрузка заведений...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: COLORS.error + '15',
        color: COLORS.error,
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: `1px solid ${COLORS.error}`
      }}>
        {error}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Статистика */}
      <VenuesStats stats={stats} />

      {/* Таблица */}
      <VenuesTable venues={venues} />
    </div>
  )
}
