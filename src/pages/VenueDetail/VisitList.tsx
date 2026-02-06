import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api'
import { COLORS } from '../../pages/Landing'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faUser, faAward, faClock, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

interface Visit {
  id: string
  user_id: string
  user_name: string
  user_phone: string
  telegram_id: string
  points_earned: number
  created_at: string
}

interface VisitResponse {
  visits: Visit[]
  total_count: number
  page: number
  limit: number
  total_pages: number
}

export default function VisitList({ businessId }: { businessId: number }) {
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [limit] = useState(20)

  useEffect(() => {
    fetchVisits()
  }, [businessId, currentPage])

  const fetchVisits = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getVisitsByBusiness(businessId, currentPage, limit)

      // ПРАВИЛЬНАЯ ДЕСТРУКТУРИЗАЦИЯ
      const apiData: VisitResponse = response.data

      setVisits(Array.isArray(apiData.visits) ? apiData.visits : [])
      setTotalCount(apiData.total_count || 0)
      setTotalPages(apiData.total_pages || 0)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching visits:', err)
      setError(err.response?.data?.message || 'Ошибка загрузки посещений')
      setVisits([])
      setTotalCount(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
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
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <p style={{ color: '#999', fontSize: '14px' }}>Загрузка посещений...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '16px',
        padding: '24px',
        color: '#856404',
        fontSize: '14px'
      }}>
        {error}
      </div>
    )
  }

  if (!visits || visits.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        border: `1px solid ${COLORS.border}`,
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#f5f5f5',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <FontAwesomeIcon icon={faCalendar} style={{ fontSize: '48px', color: '#999' }} />
        </div>
        <p style={{
          fontSize: '16px',
          fontWeight: '600',
          color: COLORS.text,
          marginBottom: '8px'
        }}>
          Нет посещений
        </p>
        <p style={{
          color: '#999',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          Посещения появятся после того, как клиенты начнут пользоваться системой
        </p>
      </div>
    )
  }

  // ЕСЛИ ЕСТЬ ПОСЕЩЕНИЯ - ОТОБРАЖАЕМ ЗАГОЛОВОК И СПИСОК
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '16px 24px',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        border: `1px solid ${COLORS.border}`
      }}>
        <div>
          <div style={{ fontSize: '12px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Последние посещения
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.text }}>
            {totalCount} посещений
          </div>
        </div>
        <button
          onClick={fetchVisits}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f5f5f5',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            color: '#666',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
        >
          <FontAwesomeIcon icon={faClock} style={{ marginRight: '6px' }} />
          Обновить
        </button>
      </div>

      <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
        {visits.map((visit) => (
          <VisitCard key={visit.id} visit={visit} />
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`
        }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '8px 12px',
              backgroundColor: currentPage === 1 ? '#e0e0e0' : '#f5f5f5',
              border: 'none',
              borderRadius: '8px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              color: currentPage === 1 ? '#999' : '#666',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => currentPage !== 1 && (e.currentTarget.style.backgroundColor = '#e0e0e0')}
            onMouseLeave={(e) => currentPage !== 1 && (e.currentTarget.style.backgroundColor = '#f5f5f5')}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} style={{ padding: '8px 12px', color: '#999', fontSize: '14px' }}>
                ...
              </span>
            ) : (
              <button
                key={`page-${page}`}
                onClick={() => handlePageChange(page as number)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: currentPage === page ? COLORS.primary : '#f5f5f5',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: currentPage === page ? 'white' : '#666',
                  fontSize: '14px',
                  fontWeight: currentPage === page ? '600' : '400',
                  minWidth: '32px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => currentPage !== page && (e.currentTarget.style.backgroundColor = '#e0e0e0')}
                onMouseLeave={(e) => currentPage !== page && (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              >
                {page}
              </button>
            )
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 12px',
              backgroundColor: currentPage === totalPages ? '#e0e0e0' : '#f5f5f5',
              border: 'none',
              borderRadius: '8px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              color: currentPage === totalPages ? '#999' : '#666',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => currentPage !== totalPages && (e.currentTarget.style.backgroundColor = '#e0e0e0')}
            onMouseLeave={(e) => currentPage !== totalPages && (e.currentTarget.style.backgroundColor = '#f5f5f5')}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}
    </div>
  )
}

function VisitCard({ visit }: { visit: Visit }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      border: `1px solid ${COLORS.border}`,
      transition: 'all 0.2s',
      cursor: 'pointer'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
        e.currentTarget.style.transform = 'translateX(4px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateX(0)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#f5f5f5',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: '#666'
          }}>
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: COLORS.text, marginBottom: '2px' }}>
              {visit.user_name}
            </div>
            {visit.user_phone && (
              <div style={{ fontSize: '13px', color: '#666' }}>
                📞 {visit.user_phone}
              </div>
            )}
            {visit.telegram_id && (
              <div style={{ fontSize: '13px', color: '#666' }}>
                💬 @{visit.telegram_id}
              </div>
            )}
          </div>
        </div>
        <div style={{
          padding: '6px 12px',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '600',
          color: '#4CAF50',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <FontAwesomeIcon icon={faAward} />
          <span>+{visit.points_earned}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#666' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <FontAwesomeIcon icon={faCalendar} size="sm" />
          <span>
            {new Date(visit.created_at).toLocaleDateString('ru-RU', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#e0e0e0' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <FontAwesomeIcon icon={faUser} size="sm" />
          <span>ID: {visit.user_id.substring(0, 8)}...</span>
        </div>
      </div>
    </div>
  )
}
