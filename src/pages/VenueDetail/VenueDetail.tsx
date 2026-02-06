import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { adminApi } from '../../services/api'
import { COLORS } from '../Landing'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStore, 
  faMapMarkerAlt, 
  faPhone, 
  faCalendar, 
  faUsers, 
  faArrowLeft,
  faChartLine,
  faPen,
  faSave,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import VisitList from './VisitList'
import VisitsChart from './VisitsChart'
import TopVisitors from './TopVisitors'

interface Venue {
  id: number
  name: string
  address: string
  description?: string
  category?: string
  phone?: string
  visits_count?: number
  created_at: string
  is_active: boolean
}

interface VenueStats {
  today: number
  week: number
  month: number
  total: number
}

export default function VenueDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [venue, setVenue] = useState<Venue | null>(null)
  const [venueStats, setVenueStats] = useState<VenueStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({
    name: '',
    address: '',
    phone: '',
    description: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) {
      fetchVenue(Number(id))
      fetchVenueStats(Number(id))
    }
  }, [id])

  useEffect(() => {
    if (venue) {
      setEditedData({
        name: venue.name,
        address: venue.address || '',
        phone: venue.phone || '',
        description: venue.description || ''
      })
    }
  }, [venue])

  const fetchVenue = async (venueId: number) => {
    try {
      setLoading(true)
      const response = await adminApi.getVenueById(venueId)
      setVenue(response.data)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching venue:', err)
      setError(err.response?.data?.message || 'Ошибка загрузки заведения')
    } finally {
      setLoading(false)
    }
  }

  const fetchVenueStats = async (venueId: number) => {
    try {
      const response = await adminApi.getVenueStats(venueId)
      setVenueStats(response.data)
    } catch (err: any) {
      console.error('Error fetching venue stats:', err)
      setVenueStats({ today: 0, week: 0, month: 0, total: 0 })
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    if (venue) {
      setEditedData({
        name: venue.name,
        address: venue.address || '',
        phone: venue.phone || '',
        description: venue.description || ''
      })
    }
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!venue) return
    
    try {
      setSaving(true)
      
      // Формируем данные для обновления (только измененные поля)
      const updateData: any = {}
      if (editedData.name !== venue.name) updateData.name = editedData.name
      if (editedData.address !== (venue.address || '')) updateData.address = editedData.address
      if (editedData.phone !== (venue.phone || '')) updateData.phone = editedData.phone
      if (editedData.description !== (venue.description || '')) updateData.description = editedData.description

      if (Object.keys(updateData).length === 0) {
        setIsEditing(false)
        return
      }

      await adminApi.updateVenue(venue.id, updateData)
      
      // Обновляем данные заведения
      setVenue(prev => prev ? {...prev, ...updateData} : null)
      
      setIsEditing(false)
      
      // Показываем уведомление об успехе
      alert('Данные заведения успешно обновлены!')
    } catch (err: any) {
      console.error('Error updating venue:', err)
      alert(err.response?.data?.message || 'Ошибка при сохранении данных')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setEditedData(prev => ({ ...prev, [field]: value }))
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
          Загрузка заведения...
        </div>
      </div>
    )
  }

  if (error || !venue) {
    return (
      <div style={{
        backgroundColor: COLORS.error + '15',
        color: COLORS.error,
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: `1px solid ${COLORS.error}`
      }}>
        {error || 'Заведение не найдено'}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Кнопка назад */}
      <button
        onClick={handleBack}
        style={{
          marginBottom: '32px',
          padding: '12px 24px',
          backgroundColor: '#f5f5f5',
          color: '#333',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>Назад к списку заведений</span>
      </button>

      {/* Заголовок */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: COLORS.primary + '15',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: COLORS.primary
          }}>
            <FontAwesomeIcon icon={faStore} />
          </div>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: COLORS.text,
              margin: 0,
              marginBottom: '4px'
            }}>
              {venue.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#666', fontSize: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span>{venue.address || 'Адрес не указан'}</span>
              </span>
              {venue.phone && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FontAwesomeIcon icon={faPhone} />
                  <span>{venue.phone}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Статистика - РЕАЛЬНЫЕ ДАННЫЕ */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: COLORS.text,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FontAwesomeIcon icon={faChartLine} />
          <span>Статистика</span>
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          <StatCard 
            title="Посещений сегодня" 
            value={venueStats?.today || 0} 
            icon={faCalendar} 
            color="#2196F3"
            bgColor="rgba(33, 150, 243, 0.1)"
          />
          <StatCard 
            title="Посещений за неделю" 
            value={venueStats?.week || 0} 
            icon={faCalendar} 
            color="#FF9800"
            bgColor="rgba(255, 152, 0, 0.1)"
          />
          <StatCard 
            title="Посещений за месяц" 
            value={venueStats?.month || 0} 
            icon={faCalendar} 
            color="#9C27B0"
            bgColor="rgba(156, 39, 176, 0.1)"
          />
          <StatCard 
            title="Всего посещений" 
            value={venueStats?.total || venue.visits_count || 0} 
            icon={faUsers} 
            color="#4CAF50"
            bgColor="rgba(76, 175, 80, 0.1)"
          />
        </div>
      </div>

      {/* Информация о заведении - РЕДАКТИРУЕМАЯ */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: COLORS.text,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FontAwesomeIcon icon={faStore} />
            <span>Информация о заведении</span>
          </h2>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              style={{
                padding: '8px 16px',
                backgroundColor: COLORS.primary + '15',
                color: COLORS.primary,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primary + '25'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary + '15'}
            >
              <FontAwesomeIcon icon={faPen} />
              <span>Редактировать</span>
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '8px 16px',
                  backgroundColor: saving ? '#ccc' : COLORS.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = COLORS.primaryDark)}
                onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = COLORS.primary)}
              >
                <FontAwesomeIcon icon={faSave} />
                <span>{saving ? 'Сохранение...' : 'Сохранить'}</span>
              </button>
              <button
                onClick={handleCancel}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              >
                <FontAwesomeIcon icon={faTimes} />
                <span>Отмена</span>
              </button>
            </div>
          )}
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: `1px solid ${COLORS.border}`,
          padding: '24px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Название */}
            <div>
              <div style={{ 
                fontSize: '12px', 
                color: '#999', 
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <FontAwesomeIcon icon={faStore} size="xs" />
                <span>Название заведения</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    color: COLORS.text,
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = COLORS.primary}
                  onBlur={(e) => e.currentTarget.style.borderColor = COLORS.border}
                />
              ) : (
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '600',
                  color: COLORS.text,
                  padding: '12px 0'
                }}>
                  {venue.name}
                </div>
              )}
            </div>

            {/* Адрес */}
            <div>
              <div style={{ 
                fontSize: '12px', 
                color: '#999', 
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} size="xs" />
                <span>Адрес</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Введите адрес"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    color: COLORS.text,
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = COLORS.primary}
                  onBlur={(e) => e.currentTarget.style.borderColor = COLORS.border}
                />
              ) : (
                <div style={{ 
                  fontSize: '16px', 
                  color: '#666',
                  padding: '12px 0'
                }}>
                  {venue.address || 'Адрес не указан'}
                </div>
              )}
            </div>

            {/* Телефон */}
            <div>
              <div style={{ 
                fontSize: '12px', 
                color: '#999', 
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <FontAwesomeIcon icon={faPhone} size="xs" />
                <span>Телефон</span>
              </div>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    color: COLORS.text,
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = COLORS.primary}
                  onBlur={(e) => e.currentTarget.style.borderColor = COLORS.border}
                />
              ) : (
                <div style={{ 
                  fontSize: '16px', 
                  color: '#666',
                  padding: '12px 0'
                }}>
                  {venue.phone || 'Телефон не указан'}
                </div>
              )}
            </div>

            {/* Категория */}
            <div>
              <div style={{ 
                fontSize: '12px', 
                color: '#999', 
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <FontAwesomeIcon icon={faStore} size="xs" />
                <span>Категория</span>
              </div>
              <div style={{ 
                fontSize: '16px', 
                color: '#666',
                padding: '12px 0'
              }}>
                {venue.category || 'Не указана'}
              </div>
            </div>

            {/* Дата создания */}
            <div>
              <div style={{ 
                fontSize: '12px', 
                color: '#999', 
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <FontAwesomeIcon icon={faCalendar} size="xs" />
                <span>Дата создания</span>
              </div>
              <div style={{ 
                fontSize: '16px', 
                color: '#666',
                padding: '12px 0'
              }}>
                {new Date(venue.created_at).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            {/* ID заведения */}
            <div>
              <div style={{ 
                fontSize: '12px', 
                color: '#999', 
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <FontAwesomeIcon icon={faCalendar} size="xs" />
                <span>ID заведения</span>
              </div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: '600',
                color: COLORS.text,
                padding: '12px 0'
              }}>
                #{venue.id}
              </div>
            </div>
          </div>

          {/* Описание - редактируемое */}
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${COLORS.border}` }}>
            <div style={{ 
              fontSize: '13px', 
              color: '#999', 
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <FontAwesomeIcon icon={faPen} size="xs" />
              <span>Описание</span>
            </div>
            {isEditing ? (
              <textarea
                value={editedData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Введите описание заведения..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '12px',
                  fontSize: '15px',
                  color: COLORS.text,
                  lineHeight: '1.6',
                  resize: 'vertical',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = COLORS.primary}
                onBlur={(e) => e.currentTarget.style.borderColor = COLORS.border}
              />
            ) : (
              <div style={{ 
                fontSize: '15px', 
                color: '#666',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                minHeight: '60px'
              }}>
                {venue.description || 'Описание не добавлено'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Топ-5 посетителей */}
      {venueStats?.total && venueStats.total > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <TopVisitors businessId={venue.id} />
        </div>
      )}

      {/* График посещений */}
      {venueStats?.total && venueStats.total > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <VisitsChart businessId={venue.id} totalVisits={venueStats.total} />
        </div>
      )}

      {/* Последние посещения */}
      <div>
        <VisitList businessId={venue.id} />
      </div>
    </div>
  )
}

// Компонент карточки статистики
function StatCard({ title, value, icon, color, bgColor }: { title: string, value: number | string, icon: any, color: string, bgColor: string }) {
  return (
    <div style={{
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
          <div style={{ fontSize: '13px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            {title}
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.text, lineHeight: '1.2' }}>
            {value}
          </div>
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: bgColor,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          color: color
        }}>
          <FontAwesomeIcon icon={icon} />
        </div>
      </div>
    </div>
  )
}

// Компонент элемента информации
function InfoItem({ label, value, icon }: { label: string, value: string, icon: any }) {
  return (
    <div>
      <div style={{ 
        fontSize: '12px', 
        color: '#999', 
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <FontAwesomeIcon icon={icon} size="xs" />
        <span>{label}</span>
      </div>
      <div style={{ 
        fontSize: '16px', 
        fontWeight: '600',
        color: COLORS.text,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {value}
      </div>
    </div>
  )
}

function handleBack() {
  window.history.back()
}
