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
  faTimes,
  faTag,
  faCopy,
  faCheck,  // ← ДОБАВЛЯЕМ ЭТУ СТРОКУ
  faBook
} from '@fortawesome/free-solid-svg-icons'
import VisitList from './VisitList'
import VisitsChart from './VisitsChart'
import TopVisitors from './TopVisitors'
import RewardsSection from './RewardsSection'

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
  const [isNfcModalOpen, setIsNfcModalOpen] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

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

  // Генерируем уникальный URL для NFC метки
  const getNfcUrl = () => {
    if (!venue) return ''
    const shopId = venue.id.toString().padStart(3, '0')
    return `https://t.me/loyality_test1_bot?startapp=shop_${shopId}`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getNfcUrl())
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      alert('Не удалось скопировать ссылку. Попробуйте выделить и скопировать вручную.')
    }
  }

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
      setVenue(prev => prev ? { ...prev, ...updateData } : null)

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

  const handleBack = () => {
    navigate('/venues')
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
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

      {/* NFC метка */}
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
            <FontAwesomeIcon icon={faTag} />
            <span>NFC метка</span>
          </h2>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: `1px solid ${COLORS.border}`,
          padding: '24px'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '12px',
              color: '#999',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '600'
            }}>
              Уникальная ссылка для NFC метки
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch' }}>
              <input
                type="text"
                value={getNfcUrl()}
                readOnly
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '12px',
                  fontSize: '15px',
                  color: COLORS.text,
                  backgroundColor: '#f9fafb',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={(e) => e.currentTarget.select()}
              />
              <button
                onClick={copyToClipboard}
                style={{
                  padding: '0 20px',
                  backgroundColor: copySuccess ? '#4CAF50' : COLORS.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (!copySuccess) {
                    e.currentTarget.style.backgroundColor = COLORS.primaryDark
                  }
                }}
                onMouseLeave={(e) => {
                  if (!copySuccess) {
                    e.currentTarget.style.backgroundColor = COLORS.primary
                  }
                }}
              >
                <FontAwesomeIcon icon={copySuccess ? faCheck : faCopy} style={{ marginRight: '6px' }} />
                <span>{copySuccess ? 'Скопировано!' : 'Скопировать'}</span>
              </button>
            </div>
            <div style={{
              fontSize: '13px',
              color: '#666',
              marginTop: '8px',
              fontStyle: 'italic'
            }}>
              Эта ссылка будет записана на NFC метку. При прикладывании метки к телефону клиент будет перенаправлен в Telegram бот.
            </div>
          </div>

          <button
            onClick={() => setIsNfcModalOpen(true)}
            style={{
              width: '100%',
              padding: '14px 24px',
              backgroundColor: '#f0f7ff',
              color: '#1976d2',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e3f2fd'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f7ff'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(25, 118, 210, 0.15)'
            }}
          >
            <FontAwesomeIcon icon={faBook} />
            <span>Инструкция - как запрограммировать метку</span>
          </button>
        </div>
      </div>

      {/* Доступные награды */}
      <div style={{ marginBottom: '32px' }}>
        <RewardsSection businessId={venue.id} />
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

      {/* Модальное окно с инструкцией */}
      {isNfcModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '85vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsNfcModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#999',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              ✕
            </button>

            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: COLORS.text,
              marginBottom: '24px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <FontAwesomeIcon icon={faTag} style={{ color: COLORS.primary }} />
              <span>Инструкция по программированию NFC метки</span>
            </h2>

            <div style={{ fontSize: '16px', color: '#555', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '20px', backgroundColor: '#fff8e1', padding: '16px', borderRadius: '12px', borderLeft: `4px solid #ffc107` }}>
                <strong style={{ color: '#5d4037', display: 'block', marginBottom: '8px' }}>Что такое NFC метка?</strong>
                <span style={{ color: '#795548' }}>
                  NFC (Near Field Communication) — это технология беспроводной связи на коротких расстояниях.
                  Метка представляет собой небольшой чип, на который можно записать ссылку.
                  При прикладывании метки к телефону клиент автоматически перейдет в Telegram бот для регистрации визита.
                </span>
              </p>

              <ol style={{ paddingLeft: '24px', marginBottom: '28px' }}>
                <li style={{ marginBottom: '16px' }}>
                  <strong>Приобретите NFC метки</strong>
                  <div style={{ marginTop: '8px', paddingLeft: '16px', borderLeft: `3px solid ${COLORS.primary}`, padding: '12px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
                    Рекомендуемый тип: <strong>NTAG215</strong> (стоимость ~15-30 рублей за штуку).
                    Метки можно купить на Яндекс.Маркете, Авито или в специализированных магазинах электроники.
                  </div>
                </li>
                <li style={{ marginBottom: '16px' }}>
                  <strong>Скачайте приложение для записи меток</strong>
                  <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div style={{ padding: '12px', backgroundColor: '#e3f2fd', borderRadius: '10px', border: '1px solid #bbdefb' }}>
                      <div style={{ fontWeight: '600', color: '#1976d2', marginBottom: '6px' }}>Android:</div>
                      <a
                        href="https://play.google.com/store/apps/details?id=com.wakdev.wdnfc"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: COLORS.primary, textDecoration: 'none', fontWeight: '500' }}
                      >
                        NFC Tools
                      </a>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: '#e8f5e9', borderRadius: '10px', border: '1px solid #c8e6c9' }}>
                      <div style={{ fontWeight: '600', color: '#2e7d32', marginBottom: '6px' }}>iOS:</div>
                      <a
                        href="https://apps.apple.com/app/nfc-tagwriter-by-nxp/id1228381157"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#2e7d32', textDecoration: 'none', fontWeight: '500' }}
                      >
                        NFC TagWriter
                      </a>
                    </div>
                  </div>
                </li>
                <li style={{ marginBottom: '16px' }}>
                  <strong>Запишите ссылку на метку</strong>
                  <div style={{ marginTop: '8px', paddingLeft: '16px', borderLeft: `3px solid ${COLORS.primary}`, padding: '12px', backgroundColor: '#f3e5f5', borderRadius: '8px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600', color: '#4a148c' }}>В приложении:</span>
                      Выберите «Записать метку» → «Добавить запись» → «Ссылка (URL)»
                    </div>
                    <div style={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      padding: '12px',
                      marginTop: '8px',
                      fontSize: '14px',
                      wordBreak: 'break-all',
                      border: `1px dashed ${COLORS.primary}`
                    }}>
                      {getNfcUrl()}
                    </div>
                  </div>
                </li>
                <li>
                  <strong>Проверьте работу метки</strong>
                  <div style={{ marginTop: '8px', paddingLeft: '16px', borderLeft: `3px solid ${COLORS.primary}`, padding: '12px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
                    Приложите метку к телефону (обычно к задней крышке).
                    Должно появиться уведомление с предложением открыть ссылку в Telegram.
                  </div>
                </li>
              </ol>

              <div style={{
                backgroundColor: '#e3f2fd',
                border: `1px solid #90caf9`,
                borderRadius: '12px',
                padding: '20px',
                marginTop: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#1976d2',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    ℹ️
                  </div>
                  <div>
                    <strong style={{ color: '#1976d2', display: 'block', marginBottom: '6px' }}>Важно:</strong>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#1976d2' }}>
                      <li>Убедитесь, что на телефоне включена поддержка NFC в настройках</li>
                      <li>Метку лучше разместить на кассе или входной двери на высоте 1-1.5 метра</li>
                      <li>Для защиты от случайной перезаписи активируйте опцию «Защита от записи» в приложении</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsNfcModalOpen(false)}
              style={{
                width: '100%',
                padding: '16px 24px',
                backgroundColor: COLORS.primary,
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                fontSize: '17px',
                fontWeight: '600',
                marginTop: '28px',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(255, 140, 66, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primaryDark
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 140, 66, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 140, 66, 0.4)'
              }}
            >
              Понятно, приступаю к настройке!
            </button>
          </div>
        </div>
      )}
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
