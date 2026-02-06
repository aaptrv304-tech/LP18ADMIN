import { useState, useEffect } from 'react'
import { adminApi } from '../../services/api'
import { COLORS } from '../../pages/Landing'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGift,
  faPlus,
  faPen,
  faTrash,
  faToggleOn,
  faToggleOff,
  faCheckCircle,
  faTimesCircle,
  faPercent,
  faMugHot,
  faScissors,
  faStar,
  faUtensils,
  faSpa,
  faCrown,
  faCakeCandles,
  faTooth,
  faSearch
} from '@fortawesome/free-solid-svg-icons'

interface Reward {
  id: number
  name: string
  description: string
  points_cost: number
  is_active: boolean
  created_at: string
  icon?: string
}

// Цветовые схемы для иконок
const ICON_STYLES = {
  gift: { bg: 'linear-gradient(to bottom right, #dbeafe, #bfdbfe)', color: '#3b82f6' },
  percent: { bg: 'linear-gradient(to bottom right, #ede9fe, #ddd6fe)', color: '#8b5cf6' },
  'mug-hot': { bg: 'linear-gradient(to bottom right, #dcfce7, #bbf7d0)', color: '#22c55e' },
  scissors: { bg: 'linear-gradient(to bottom right, #ffedd5, #fed7aa)', color: '#f97316' },
  star: { bg: 'linear-gradient(to bottom right, #fee2e2, #fecaca)', color: '#ef4444' },
  utensils: { bg: 'linear-gradient(to bottom right, #e0e7ff, #c7d2fe)', color: '#6366f1' },
  spa: { bg: 'linear-gradient(to bottom right, #ccfbf1, #99f6e4)', color: '#14b8a6' },
  crown: { bg: 'linear-gradient(to bottom right, #fef9c3, #fde047)', color: '#eab308' },
  'cake-candles': { bg: 'linear-gradient(to bottom right, #ffe4e6, #fecaca)', color: '#f43f5e' },
  tooth: { bg: 'linear-gradient(to bottom right, #cffafe, #a5f3fc)', color: '#06b6d4' },
  default: { bg: 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)', color: '#6b7280' }
}

// Доступные иконки для выбора
const ICON_OPTIONS = [
  { name: 'gift', icon: faGift, label: 'Подарок' },
  { name: 'percent', icon: faPercent, label: 'Скидка' },
  { name: 'mug-hot', icon: faMugHot, label: 'Напиток' },
  { name: 'scissors', icon: faScissors, label: 'Стрижка' },
  { name: 'star', icon: faStar, label: 'VIP' },
  { name: 'utensils', icon: faUtensils, label: 'Еда' },
  { name: 'spa', icon: faSpa, label: 'СПА' },
  { name: 'crown', icon: faCrown, label: 'Премиум' },
  { name: 'cake-candles', icon: faCakeCandles, label: 'Торт' },
  { name: 'tooth', icon: faTooth, label: 'Стоматология' }
]

export default function RewardsSection({ businessId }: { businessId: number }) {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReward, setEditingReward] = useState<Reward | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    points_cost: '',
    is_active: true,
    icon: 'gift'
  })
  const [searchIcon, setSearchIcon] = useState('')

  useEffect(() => {
    fetchRewards()
  }, [businessId])

  const fetchRewards = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getRewards(businessId)

      // Нормализуем данные: если ответ не массив — используем пустой массив
      const data = Array.isArray(response.data) ? response.data : []
      setRewards(data)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching rewards:', err)
      setError(err.response?.data?.message || 'Ошибка загрузки наград')
      setRewards([]) // Всегда устанавливаем пустой массив при ошибке
    } finally {
      setLoading(false)
    }
  }

  // ... остальной код без изменений (handleAddReward, handleEditReward и т.д.) ...

  // Остальной код остаётся точно таким же, как в предыдущей версии
  // Я сохраняю полный файл для уверенности, что все функции на месте

  const handleAddReward = () => {
    setEditingReward(null)
    setFormData({
      name: '',
      description: '',
      points_cost: '',
      is_active: true,
      icon: 'gift'
    })
    setSearchIcon('')
    setIsModalOpen(true)
  }

  const handleEditReward = (reward: Reward) => {
    setEditingReward(reward)
    setFormData({
      name: reward.name,
      description: reward.description || '',
      points_cost: reward.points_cost.toString(),
      is_active: reward.is_active,
      icon: reward.icon || 'gift'
    })
    setSearchIcon('')
    setIsModalOpen(true)
  }

  const handleDeleteReward = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту награду?')) return

    try {
      await adminApi.deleteReward(id)
      setRewards(rewards.filter(r => r.id !== id))
      alert('Награда успешно удалена!')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка при удалении награды')
    }
  }

  const handleToggleActive = async (reward: Reward) => {
    try {
      // ✅ Отправляем запрос на новый эндпоинт
      await adminApi.toggleRewardActive(reward.id)

      // Обновляем локальное состояние
      const updatedReward = { ...reward, is_active: !reward.is_active }
      setRewards(rewards.map(r =>
        r.id === reward.id ? updatedReward : r
      ))
    } catch (err: any) {
      console.error('Ошибка при переключении статуса:', err)
      alert(err.response?.data?.message || 'Ошибка при обновлении статуса')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.points_cost) {
      alert('Пожалуйста, заполните все обязательные поля')
      return
    }

    try {
      const pointsCost = parseInt(formData.points_cost)
      if (isNaN(pointsCost) || pointsCost <= 0) {
        alert('Стоимость в очках должна быть положительным числом')
        return
      }

      const rewardData = {
        name: formData.name,
        description: formData.description,
        points_cost: pointsCost,
        is_active: formData.is_active,
        icon: formData.icon
      }

      if (editingReward) {
        await adminApi.updateReward(editingReward.id, rewardData)
        setRewards(rewards.map(r =>
          r.id === editingReward.id ? { ...r, ...rewardData } : r
        ))
        alert('Награда успешно обновлена!')
      } else {
        const response = await adminApi.createReward(businessId, rewardData)
        setRewards([...rewards, response.data])
        alert('Награда успешно добавлена!')
      }

      setIsModalOpen(false)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка при сохранении награды')
    }
  }

  const getIconStyle = (iconName: string) => {
    return ICON_STYLES[iconName as keyof typeof ICON_STYLES] || ICON_STYLES.default
  }

  const filteredIcons = ICON_OPTIONS.filter(icon =>
    icon.label.toLowerCase().includes(searchIcon.toLowerCase()) ||
    icon.name.includes(searchIcon.toLowerCase())
  )

  if (loading) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        border: `1px solid ${COLORS.border}`,
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎁</div>
        <p style={{ color: '#999', fontSize: '14px' }}>Загрузка наград...</p>
      </div>
    )
  }

  return (
    <div>
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
          <FontAwesomeIcon icon={faGift} />
          <span>Доступные награды</span>
        </h2>
        <button
          onClick={handleAddReward}
          style={{
            padding: '10px 20px',
            backgroundColor: COLORS.primary,
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(255, 140, 66, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.primaryDark
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 140, 66, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.primary
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 140, 66, 0.3)'
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Добавить награду</span>
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        border: `1px solid ${COLORS.border}`,
        padding: '24px'
      }}>
        {error && (
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            color: '#856404'
          }}>
            {error}
          </div>
        )}

        {rewards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎁</div>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>Нет доступных наград</p>
            <p style={{ fontSize: '14px' }}>Добавьте первую награду для ваших клиентов</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {rewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                onEdit={handleEditReward}
                onDelete={handleDeleteReward}
                onToggleActive={handleToggleActive}
                getIconStyle={getIconStyle}
              />
            ))}
          </div>
        )}
      </div>

      {/* Модальное окно для добавления/редактирования награды */}
      {isModalOpen && (
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
              onClick={() => setIsModalOpen(false)}
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
              textAlign: 'center'
            }}>
              {editingReward ? 'Редактировать награду' : 'Добавить новую награду'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  Название награды <span style={{ color: COLORS.primary }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Например: Бесплатный кофе"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    color: COLORS.text,
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = COLORS.primary}
                  onBlur={(e) => e.currentTarget.style.borderColor = COLORS.border}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Опишите, что получит клиент"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    color: COLORS.text,
                    lineHeight: '1.5',
                    resize: 'vertical',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = COLORS.primary}
                  onBlur={(e) => e.currentTarget.style.borderColor = COLORS.border}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  Стоимость в очках <span style={{ color: COLORS.primary }}>*</span>
                </label>
                <input
                  type="number"
                  value={formData.points_cost}
                  onChange={(e) => setFormData({ ...formData, points_cost: e.target.value })}
                  placeholder="100"
                  required
                  min="1"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    color: COLORS.text,
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = COLORS.primary}
                  onBlur={(e) => e.currentTarget.style.borderColor = COLORS.border}
                />
                <div style={{ fontSize: '13px', color: '#666', marginTop: '6px' }}>
                  Сколько очков нужно клиенту, чтобы получить эту награду
                </div>
              </div>

              {/* Выбор иконки */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '12px'
                }}>
                  Выберите иконку награды
                </label>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{
                    position: 'relative',
                    width: '100%'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#999'
                    }}>
                      <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <input
                      type="text"
                      value={searchIcon}
                      onChange={(e) => setSearchIcon(e.target.value)}
                      placeholder="Поиск иконок..."
                      style={{
                        width: '100%',
                        paddingLeft: '48px',
                        paddingRight: '16px',
                        paddingTop: '10px',
                        paddingBottom: '10px',
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
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
                  gap: '12px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  padding: '8px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '12px',
                  backgroundColor: '#fafafa'
                }}>
                  {filteredIcons.map((option) => {
                    const isSelected = formData.icon === option.name
                    const style = getIconStyle(option.name)

                    return (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: option.name })}
                        style={{
                          width: '100%',
                          height: '60px',
                          borderRadius: '10px',
                          border: isSelected ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`,
                          background: style.bg,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          padding: '4px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)'
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        <FontAwesomeIcon
                          icon={option.icon}
                          style={{
                            fontSize: '24px',
                            color: style.color,
                            marginBottom: '4px'
                          }}
                        />
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '500',
                          color: '#666',
                          textAlign: 'center',
                          lineHeight: '1.2'
                        }}>
                          {option.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <div style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
                  Выберите иконку, которая будет отображаться в Telegram Mini App
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="is_active" style={{ fontSize: '15px', fontWeight: '500', color: COLORS.text, cursor: 'pointer' }}>
                  Награда активна
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    backgroundColor: COLORS.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
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
                  {editingReward ? 'Сохранить изменения' : 'Добавить награду'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                    border: 'none',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function RewardCard({
  reward,
  onEdit,
  onDelete,
  onToggleActive,
  getIconStyle
}: {
  reward: Reward;
  onEdit: (reward: Reward) => void;
  onDelete: (id: number) => void;
  onToggleActive: (reward: Reward) => void;
  getIconStyle: (iconName: string) => { bg: string; color: string };
}) {
  const iconStyle = getIconStyle(reward.icon || 'gift')

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      border: `1px solid ${COLORS.border}`,
      overflow: 'hidden',
      transition: 'all 0.2s',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Иконка награды */}
      <div style={{
        height: '120px',
        background: iconStyle.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <FontAwesomeIcon
          icon={
            reward.icon === 'gift' ? faGift :
              reward.icon === 'percent' ? faPercent :
                reward.icon === 'mug-hot' ? faMugHot :
                  reward.icon === 'scissors' ? faScissors :
                    reward.icon === 'star' ? faStar :
                      reward.icon === 'utensils' ? faUtensils :
                        reward.icon === 'spa' ? faSpa :
                          reward.icon === 'crown' ? faCrown :
                            reward.icon === 'cake-candles' ? faCakeCandles :
                              reward.icon === 'tooth' ? faTooth : faGift
          }
          style={{
            fontSize: '48px',
            color: iconStyle.color
          }}
        />

        {/* Статус активности */}
        {reward.is_active ? (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '24px',
            height: '24px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'white', fontSize: '10px' }} />
          </div>
        ) : (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '24px',
            height: '24px',
            backgroundColor: '#ef4444',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'white', fontSize: '10px' }} />
          </div>
        )}
      </div>

      {/* Контент награды */}
      <div style={{ padding: '16px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: COLORS.text,
          marginBottom: '8px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {reward.name}
        </h3>

        <div style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: COLORS.primary,
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>⭐</span>
          <span>{reward.points_cost} очков</span>
        </div>

        {reward.description && (
          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '12px',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {reward.description}
          </p>
        )}

        <div style={{
          fontSize: '13px',
          color: '#999',
          marginBottom: '12px'
        }}>
          Создана: {new Date(reward.created_at).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </div>

        {/* Статус и кнопки */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: `1px solid ${COLORS.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {reward.is_active ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981'
              }}>
                <FontAwesomeIcon icon={faCheckCircle} size="xs" />
                <span>Активна</span>
              </span>
            ) : (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444'
              }}>
                <FontAwesomeIcon icon={faTimesCircle} size="xs" />
                <span>Неактивна</span>
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => onToggleActive(reward)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                background: reward.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(158, 158, 158, 0.1)',
                color: reward.is_active ? '#10b981' : '#9E9E9E',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
              title={reward.is_active ? 'Деактивировать' : 'Активировать'}
            >
              <FontAwesomeIcon icon={reward.is_active ? faToggleOn : faToggleOff} size="lg" />
            </button>

            <button
              onClick={() => onEdit(reward)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#bbdefb'
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#e3f2fd'
                e.currentTarget.style.transform = 'scale(1)'
              }}
              title="Редактировать"
            >
              <FontAwesomeIcon icon={faPen} size="sm" />
            </button>

            <button
              onClick={() => onDelete(reward.id)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#ffebee',
                color: '#f44336',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffcdd2'
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffebee'
                e.currentTarget.style.transform = 'scale(1)'
              }}
              title="Удалить"
            >
              <FontAwesomeIcon icon={faTrash} size="sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
