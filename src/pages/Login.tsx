import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faEnvelope, faLock, faBolt, faMobileScreenButton, faRubleSign,
  faChartLine, faGift, faRobot, faStar, faCircleQuestion, faEnvelope as faEnvelopeOutline,
  faFileContract, faArrowTrendUp, faCircleNotch
} from '@fortawesome/free-solid-svg-icons'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await login(email, password)
      setTimeout(() => {
        navigate('/dashboard')
      }, 500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка авторизации')
    }
  }

  return (
    <div 
      id="login-container" 
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        backgroundColor: 'white',
        overflow: 'hidden',
        margin: 0
      }}
    >
      {/* Левая панель */}
      <div 
        id="left-panel"
        style={{
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '6rem',
          backgroundColor: 'white'
        }}
      >
        <div 
          id="login-form-wrapper" 
          style={{ width: '100%', maxWidth: '480px' }}
        >
          {/* Логотип */}
          <div id="logo-section" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'linear-gradient(to bottom right, #FF8C42, #E65C00)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(12deg)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                <FontAwesomeIcon 
                  icon={faCircleNotch} 
                  style={{ 
                    color: 'white',
                    fontSize: '1.25rem',
                    transform: 'rotate(-12deg)'
                  }} 
                />
              </div>
              <h1 style={{ 
                fontSize: '1.875rem', 
                fontWeight: '700', 
                color: '#1F2937'
              }}>
                Апельсинчик
              </h1>
            </div>
          </div>

          {/* Заголовок */}
          <div id="heading-section" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ 
              fontSize: '1.875rem', 
              fontWeight: '700', 
              color: '#1F2937', 
              marginBottom: '0.5rem',
              lineHeight: '1.25'
            }}>
              Вход для владельцев
            </h2>
            <p style={{ 
              fontSize: '1rem', 
              color: '#4B5563', 
              fontWeight: '500'
            }}>
              Управляйте программой лояльности
            </p>
          </div>

          {/* Форма */}
          <div id="email-password-form" style={{ marginBottom: '1.25rem' }}>
            <form 
              onSubmit={handleSubmit} 
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {/* Email */}
              <div>
                <label 
                  htmlFor="email"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: '0.5rem'
                  }}
                >
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      pointerEvents: 'none'
                    }}
                  >
                    <FontAwesomeIcon 
                      icon={faEnvelope} 
                      style={{ 
                        color: '#9CA3AF', 
                        fontSize: '0.875rem' 
                      }} 
                    />
                  </div>
                  <input 
                    type="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      paddingLeft: '2.75rem',
                      paddingRight: '1rem',
                      paddingTop: '0.75rem',
                      paddingBottom: '0.75rem',
                      border: '2px solid #E5E7EB',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      color: '#1F2937',
                      transition: 'border-color 0.2s',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#FF8C42'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                  />
                </div>
              </div>

              {/* Пароль */}
              <div>
                <label 
                  htmlFor="password"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: '0.5rem'
                  }}
                >
                  Пароль
                </label>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      pointerEvents: 'none'
                    }}
                  >
                    <FontAwesomeIcon 
                      icon={faLock} 
                      style={{ 
                        color: '#9CA3AF', 
                        fontSize: '0.875rem' 
                      }} 
                    />
                  </div>
                  <input 
                    type="password" 
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      paddingLeft: '2.75rem',
                      paddingRight: '1rem',
                      paddingTop: '0.75rem',
                      paddingBottom: '0.75rem',
                      border: '2px solid #E5E7EB',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      color: '#1F2937',
                      transition: 'border-color 0.2s',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#FF8C42'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                  />
                </div>
              </div>

              {/* Кнопка */}
              <button 
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  backgroundColor: isLoading ? '#9CA3AF' : '#FF8C42',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  padding: '0.875rem 2rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(255, 140, 66, 0.3)',
                  transition: 'all 0.3s',
                  marginTop: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#FF701F'
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 140, 66, 0.4)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#FF8C42'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 140, 66, 0.3)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }
                }}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </button>
            </form>
            {error && (
              <div style={{ 
                color: '#DC2626', 
                fontSize: '0.875rem', 
                marginTop: '0.5rem',
                padding: '0.5rem',
                backgroundColor: '#FEF2F2',
                borderRadius: '0.5rem'
              }}>
                {error}
              </div>
            )}
          </div>

          {/* Разделитель */}
          <div id="divider-section" style={{ marginBottom: '1.25rem' }}>
            <div style={{ 
              height: '1px', 
              backgroundColor: '#D1D5DB',
              width: '100%'
            }}></div>
          </div>

          {/* Преимущества */}
          <div 
            id="benefits-list" 
            style={{ 
              marginBottom: '1.25rem',
              backgroundColor: '#F8F9FA',
              borderRadius: '0.75rem',
              padding: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    backgroundColor: 'rgba(255, 140, 66, 0.1)',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <FontAwesomeIcon 
                    icon={faBolt} 
                    style={{ 
                      color: '#FF8C42', 
                      fontSize: '0.875rem' 
                    }} 
                  />
                </div>
                <div>
                  <h3 style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: '#1F2937', 
                    marginBottom: '0.125rem'
                  }}>
                    Готово за 5 минут
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#4B5563' }}>
                    Быстрая настройка без технических знаний
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <FontAwesomeIcon 
                    icon={faMobileScreenButton} 
                    style={{ 
                      color: '#3B82F6', 
                      fontSize: '0.875rem' 
                    }} 
                  />
                </div>
                <div>
                  <h3 style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: '#1F2937', 
                    marginBottom: '0.125rem'
                  }}>
                    Без установки приложения
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#4B5563' }}>
                    Работает прямо в Telegram
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <FontAwesomeIcon 
                    icon={faRubleSign} 
                    style={{ 
                      color: '#22C55E', 
                      fontSize: '0.875rem' 
                    }} 
                  />
                </div>
                <div>
                  <h3 style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: '#1F2937', 
                    marginBottom: '0.125rem'
                  }}>
                    От 1990₽/месяц
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#4B5563' }}>
                    Доступные тарифы для любого бизнеса
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div id="trust-badges" style={{ marginBottom: '1.25rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '1.5rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '700', 
                  color: '#1F2937', 
                  marginBottom: '0.125rem'
                }}>
                  1,200+
                </div>
                <div style={{ fontSize: '0.75rem', color: '#4B5563' }}>
                  Активных заведений
                </div>
              </div>
              <div style={{ width: '1px', height: '2rem', backgroundColor: '#D1D5DB' }}></div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '700', 
                  color: '#1F2937', 
                  marginBottom: '0.125rem'
                }}>
                  50,000+
                </div>
                <div style={{ fontSize: '0.75rem', color: '#4B5563' }}>
                  Довольных клиентов
                </div>
              </div>
              <div style={{ width: '1px', height: '2rem', backgroundColor: '#D1D5DB' }}></div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '700', 
                  color: '#1F2937', 
                  marginBottom: '0.125rem'
                }}>
                  4.9/5
                </div>
                <div style={{ fontSize: '0.75rem', color: '#4B5563' }}>
                  Средняя оценка
                </div>
              </div>
            </div>
          </div>

          {/* Футер */}
          <div 
            id="footer-links"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              fontSize: '0.875rem',
              color: '#4B5563'
            }}
          >
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              style={{
                color: '#4B5563',
                textDecoration: 'none',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FF8C42'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#4B5563'}
            >
              <FontAwesomeIcon icon={faCircleQuestion} style={{ fontSize: '0.875rem' }} />
              <span>Помощь</span>
            </a>
            <span style={{ color: '#9CA3AF' }}>•</span>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              style={{
                color: '#4B5563',
                textDecoration: 'none',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FF8C42'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#4B5563'}
            >
              <FontAwesomeIcon icon={faEnvelopeOutline} style={{ fontSize: '0.875rem' }} />
              <span>Контакты</span>
            </a>
            <span style={{ color: '#9CA3AF' }}>•</span>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              style={{
                color: '#4B5563',
                textDecoration: 'none',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FF8C42'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#4B5563'}
            >
              <FontAwesomeIcon icon={faFileContract} style={{ fontSize: '0.875rem' }} />
              <span>Договор</span>
            </a>
          </div>
        </div>
      </div>

      {/* Правая панель */}
      <div 
        id="right-panel"
        style={{
          width: '50%',
          background: 'linear-gradient(to bottom right, #FF8C42, #FF6B35, #E65C00)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '4rem'
        }}
      >
        {/* Фоновые элементы */}
        <div id="background-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
          <div
            style={{
              position: 'absolute',
              top: '5rem',
              left: '5rem',
              width: '16rem',
              height: '16rem',
              backgroundColor: 'white',
              borderRadius: '9999px',
              filter: 'blur(48px)'
            }}
          ></div>
          <div
            style={{
              position: 'absolute',
              bottom: '10rem',
              right: '8rem',
              width: '24rem',
              height: '24rem',
              backgroundColor: 'white',
              borderRadius: '9999px',
              filter: 'blur(48px)'
            }}
          ></div>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '31.25rem',
              height: '31.25rem',
              backgroundColor: 'white',
              borderRadius: '9999px',
              filter: 'blur(48px)'
            }}
          ></div>
        </div>

        {/* Контент */}
        <div 
          id="hero-content" 
          style={{ 
            position: 'relative', 
            zIndex: 10, 
            maxWidth: '40.625rem',
            width: '100%'
          }}
        >
          {/* Изображение */}
          <div id="hero-illustration" style={{ marginBottom: '2.5rem' }}>
            <div style={{ position: 'relative' }}>
              <img
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/23d8ec8980-4105b04961bed3bdd22a.png"
                alt="Кофейня с владельцем"
                style={{
                  width: '100%',
                  height: '17.5rem',
                  borderRadius: '1rem',
                  objectFit: 'cover',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-1.5rem',
                  right: '-1.5rem',
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <div
                  style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FontAwesomeIcon 
                    icon={faArrowTrendUp} 
                    style={{ 
                      color: '#22C55E', 
                      fontSize: '1.25rem' 
                    }} 
                  />
                </div>
                <div>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    color: '#1F2937' 
                  }}>
                    +40%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#4B5563' }}>
                    Повторные визиты
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Заголовок */}
          <div id="hero-heading" style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: 'white', 
              marginBottom: '1rem',
              lineHeight: '1.25'
            }}>
              Увеличьте повторные визиты на 40%
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              color: 'rgba(255, 255, 255, 0.9)', 
              lineHeight: '1.625'
            }}>
              Программа лояльности, которая работает для вашего бизнеса
            </p>
          </div>

          {/* Преимущества */}
          <div id="hero-features" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '0.75rem',
                padding: '1rem',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            >
              <div
                style={{
                  width: '2.75rem',
                  height: '2.75rem',
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <FontAwesomeIcon 
                  icon={faChartLine} 
                  style={{ 
                    color: '#FF8C42', 
                    fontSize: '1.125rem' 
                  }} 
                />
              </div>
              <div>
                <h3 style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  color: 'white', 
                  marginBottom: '0.125rem'
                }}>
                  Аналитика в реальном времени
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                  Отслеживайте активность клиентов
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '0.75rem',
                padding: '1rem',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            >
              <div
                style={{
                  width: '2.75rem',
                  height: '2.75rem',
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <FontAwesomeIcon 
                  icon={faGift} 
                  style={{ 
                    color: '#FF8C42', 
                    fontSize: '1.125rem' 
                  }} 
                />
              </div>
              <div>
                <h3 style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  color: 'white', 
                  marginBottom: '0.125rem'
                }}>
                  Гибкая система наград
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                  Персонализированные предложения
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '0.75rem',
                padding: '1rem',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            >
              <div
                style={{
                  width: '2.75rem',
                  height: '2.75rem',
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <FontAwesomeIcon 
                  icon={faRobot} 
                  style={{ 
                    color: '#FF8C42', 
                    fontSize: '1.125rem' 
                  }} 
                />
              </div>
              <div>
                <h3 style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  color: 'white', 
                  marginBottom: '0.125rem'
                }}>
                  Автоматизация процессов
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                  Бот сам начисляет баллы
                </p>
              </div>
            </div>
          </div>

          {/* Отзыв */}
          <div 
            id="testimonial-section"
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <img
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                alt="Алексей Петров"
                style={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '0.75rem',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
              <div>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon 
                      key={i}
                      icon={faStar} 
                      style={{ 
                        color: '#FBBF24', 
                        fontSize: '1.125rem' 
                      }} 
                    />
                  ))}
                </div>
                <p style={{
                  color: '#4B5563',
                  fontSize: '0.875rem',
                  lineHeight: '1.625',
                  marginBottom: '0.75rem'
                }}>
                  "За первый месяц количество постоянных клиентов выросло на 35%.
                  <br />Апельсинчик окупился за две недели!"
                </p>
                <div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#1F2937'
                  }}>
                    Алексей Петров
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                    Владелец кофейни "Бодрое утро", Москва
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Плавающие элементы */}
        <div 
          id="floating-elements"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '8rem',
              right: '10rem',
              width: '5rem',
              height: '5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '0.75rem',
              transform: 'rotate(12deg)',
              animation: 'pulse 3s infinite'
            }}
          ></div>
          <div
            style={{
              position: 'absolute',
              bottom: '12rem',
              left: '8rem',
              width: '6rem',
              height: '6rem',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '9999px',
              animation: 'pulse 4s infinite'
            }}
          ></div>
          <div
            style={{
              position: 'absolute',
              top: 'calc(50% - 2rem)',
              right: '6rem',
              width: '3.5rem',
              height: '3.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              borderRadius: '0.5rem',
              transform: 'rotate(-12deg)',
              animation: 'pulse 5s infinite'
            }}
          ></div>
        </div>
      </div>

      {/* Стили для анимации */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 0.2;
              transform: scale(1) rotate(12deg);
            }
            50% {
              opacity: 0.4;
              transform: scale(1.1) rotate(12deg);
            }
          }
        `}
      </style>
    </div>
  )
}
