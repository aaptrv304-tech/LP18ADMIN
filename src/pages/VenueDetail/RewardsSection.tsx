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
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons'

interface Reward {
  id: number
  name: string
  description: string
  points_cost: number
  is_active: boolean
  created_at: string
}

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
    is_active: true
  })

  useEffect(() => {
    fetchRewards()
  }, [businessId])

  const fetchRewards = async () => {
    try {
      setLoading(true)
      // Пока заглушка - в будущем будет реальный запрос
      // const response = await adminApi.getRewards(businessId)
      // setRewards(response.data)
      
      // Временные данные для демонстрации
      const mockRewards: Reward[] = [
        {
          id: 1,
          name: 'Бесплатный кофе',
          description: 'Любой кофе из меню бесплатно',
          points_cost: 100,
          is_active: true,
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          name: 'Скидка 15%',
          description: 'Скидка 15% на весь чек',
          points_cost: 250,
          is_active: true,
          created_at: '2024-01-20T14:20:00Z'
        },
        {
          id: 3,
          name: 'Десерт в подарок',
          description: 'Бесплатный десерт к любому заказу',
          points_cost: 150,
          is_active: false,
          created_at: '2024-01-25T09:15:00Z'
        }
      ]
      setRewards(mockRewards)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching rewards:', err)
      setError(err.response?.data?.message || 'Ошибка загрузки наград')
      setRewards([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddReward = () => {
    setEditingReward(null)
    setFormData({
      name: '',
      description: '',
      points_cost: '',
      is_active: true
    })
    setIsModalOpen(true)
  }

  const handleEditReward = (reward: Reward) => {
    setEditingReward(reward)
    setFormData({
      name: reward.name,
      description: reward.description,
      points_cost: reward.points_cost.toString(),
      is_active: reward.is_active
    })
    setIsModalOpen(true)
  }

  const handleDeleteReward = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту награду?')) return
    
    try {
      // Пока заглушка
      // await adminApi.deleteReward(id)
      setRewards(rewards.filter(r => r.id !== id))
      alert('Награда успешно удалена!')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка при удалении награды')
    }
  }

  const handleToggleActive = async (reward: Reward) => {
    try {
      const updatedReward = { ...reward, is_active: !reward.is_active }
      // Пока заглушка
      // await adminApi.updateReward(reward.id, { is_active: updatedReward.is_active })
      
      setRewards(rewards.map(r => 
        r.id === reward.id ? updatedReward : r
      ))
    } catch (err: any) {
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

      if (editingReward) {
        // Обновление существующей награды
        const updatedReward = {
          ...editingReward,
          name: formData.name,
          description: formData.description,
          points_cost: pointsCost,
          is_active: formData.is_active
        }
        
        // Пока заглушка
        // await adminApi.updateReward(editingReward.id, updatedReward)
        setRewards(rewards.map(r => 
          r.id === editingReward.id ? updatedReward : r
        ))
        alert('Награда успешно обновлена!')
      } else {
        // Создание новой награды
        const newReward: Reward = {
          id: Date.now(),
          name: formData.name,
          description: formData.description,
          points_cost: pointsCost,
          is_active: formData.is_active,
          created_at: new Date().toISOString()
        }
        
        // Пока заглушка
        // await adminApi.createReward(businessId, newReward)
        setRewards([...rewards, newReward])
        alert('Награда успешно добавлена!')
      }
      
      setIsModalOpen(false)
      setFormData({
        name: '',
        description: '',
        points_cost: '',
        is_active: true
      })
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка при сохранении награды')
    }
  }

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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {rewards.map((reward) => (
              <RewardCard 
                key={reward.id} 
                reward={reward} 
                onEdit={handleEditReward} 
                onDelete={handleDeleteReward}
                onToggleActive={handleToggleActive}
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
            maxWidth: '600px',
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
  onToggleActive 
}: { 
  reward: Reward; 
  onEdit: (reward: Reward) => void; 
  onDelete: (id: number) => void;
  onToggleActive: (reward: Reward) => void;
}) {
  return (
    <div style={{
      backgroundColor: '#fafafa',
      borderRadius: '16px',
      padding: '24px',
      border: `1px solid ${COLORS.border}`,
      transition: 'all 0.2s',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = '#f5f5f5'
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = '#fafafa'
      e.currentTarget.style.boxShadow = 'none'
    }}
    >
      <div style={{ flex: 1, marginRight: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.text }}>
            {reward.name}
          </div>
          {reward.is_active ? (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              color: '#4CAF50'
            }}>
              <FontAwesomeIcon icon={faCheckCircle} />
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
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              color: '#F44336'
            }}>
              <FontAwesomeIcon icon={faTimesCircle} />
              <span>Неактивна</span>
            </span>
          )}
        </div>
        
        <div style={{ fontSize: '15px', color: '#666', marginBottom: '12px', lineHeight: '1.6' }}>
          {reward.description || 'Без описания'}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#666', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.primary }}>⭐</span>
            <span style={{ fontWeight: '600' }}>{reward.points_cost} очков</span>
          </div>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#e0e0e0' }}></div>
          <div>
            Создана: {new Date(reward.created_at).toLocaleDateString('ru-RU', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={() => onToggleActive(reward)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            border: 'none',
            background: reward.is_active ? 'rgba(76, 175, 80, 0.1)' : 'rgba(158, 158, 158, 0.1)',
            color: reward.is_active ? '#4CAF50' : '#9E9E9E',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          title={reward.is_active ? 'Деактивировать' : 'Активировать'}
        >
          <FontAwesomeIcon icon={reward.is_active ? faToggleOn : faToggleOff} size="lg" />
        </button>
        
        <button
          onClick={() => onEdit(reward)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
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
          <FontAwesomeIcon icon={faPen} />
        </button>
        
        <button
          onClick={() => onDelete(reward.id)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
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
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  )
}
