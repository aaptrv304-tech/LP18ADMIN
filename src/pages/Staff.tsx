import { useState } from 'react'
import { COLORS } from './Landing'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUsers,
    faPlus,
    faPen,
    faTrash,
    faStore,
    faSearch,
    faPaperPlane,
    faClock,
    faCheckCircle,
    faChevronDown,
    faChevronUp,
    faUser
} from '@fortawesome/free-solid-svg-icons'

// Моковые данные для демонстрации
const mockVenues = [
    { id: 1, name: 'Кофейня Уют' },
    { id: 2, name: 'Салон Красоты Люкс' },
    { id: 3, name: 'Стоматология Улыбка' },
    { id: 4, name: 'Барбершоп Мастер' },
    { id: 5, name: 'Ресторан Вкусно' }
]

const mockStaff = [
    {
        id: 1,
        name: 'Иван Иванов',
        telegram_id: 6817610322,
        username: '@ivan_ivanov',
        first_name: 'Иван',
        last_name: 'Иванов',
        activation_code: '123456',
        business_id: 1,
        business_name: 'Кофейня Уют',
        role: 'cashier',
        is_active: true,
        created_at: '2026-01-15T10:00:00Z',
        last_active: '2026-02-07T14:30:00Z'
    },
    {
        id: 2,
        name: 'Мария Петрова',
        telegram_id: 7915289396,
        username: '@maria_petrova',
        first_name: 'Мария',
        last_name: 'Петрова',
        activation_code: '789012',
        business_id: 3,
        business_name: 'Стоматология Улыбка',
        role: 'cashier',
        is_active: true,
        created_at: '2026-01-20T11:00:00Z',
        last_active: '2026-02-06T09:15:00Z'
    },
    {
        id: 3,
        name: 'Алексей Смирнов',
        telegram_id: 1234567890,
        username: '@alex_smirnov',
        first_name: 'Алексей',
        last_name: 'Смирнов',
        activation_code: '345678',
        business_id: 4,
        business_name: 'Барбершоп Мастер',
        role: 'cashier',
        is_active: false,
        created_at: '2026-01-25T12:00:00Z',
        last_active: null
    },
    {
        id: 4,
        name: 'Петя Иванов',
        telegram_id: 9876543210,
        username: '@petya_ivanov',
        first_name: 'Петя',
        last_name: 'Иванов',
        activation_code: '901234',
        business_id: 1,
        business_name: 'Кофейня Уют',
        role: 'cashier',
        is_active: true,
        created_at: '2026-02-01T10:00:00Z',
        last_active: '2026-02-07T16:45:00Z'
    },
    {
        id: 5,
        name: 'Петя Иванов',
        telegram_id: 9876543210,
        username: '@petya_ivanov',
        first_name: 'Петя',
        last_name: 'Иванов',
        activation_code: '901234',
        business_id: 3,
        business_name: 'Стоматология Улыбка',
        role: 'cashier',
        is_active: true,
        created_at: '2026-02-01T10:05:00Z',
        last_active: '2026-02-07T17:00:00Z'
    },
    {
        id: 6,
        name: 'Анна Козлова',
        telegram_id: 5555555555,
        username: '@anna_kozlova',
        first_name: 'Анна',
        last_name: 'Козлова',
        activation_code: '555555',
        business_id: 2,
        business_name: 'Салон Красоты Люкс',
        role: 'cashier',
        is_active: true,
        created_at: '2026-02-05T09:00:00Z',
        last_active: '2026-02-07T10:30:00Z'
    }
]

interface Staff {
    id: number
    name: string
    telegram_id: number
    username: string
    first_name: string
    last_name: string
    activation_code: string
    business_id: number
    business_name: string
    role: string
    is_active: boolean
    created_at: string
    last_active: string | null
}

export default function StaffPage() {
    const [staffList, setStaffList] = useState<Staff[]>(mockStaff)
    const [venues] = useState(mockVenues)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
    const [formData, setFormData] = useState({
        activation_code: '',
        business_id: 0,
        name: '',
        username: '',
        first_name: '',
        last_name: '',
        telegram_id: 0,
        role: 'cashier' as string,
        is_active: true
    })
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
    const [isLoading, setIsLoading] = useState(false)
    const [codeError, setCodeError] = useState('')
    const [expandedVenues, setExpandedVenues] = useState<number[]>([])

    // Симуляция поиска кассира по коду
    const searchStaffByCode = async (code: string) => {
        setIsLoading(true)
        setCodeError('')

        if (!/^\d{6}$/.test(code)) {
            setCodeError('Код должен состоять из 6 цифр')
            setIsLoading(false)
            return
        }

        await new Promise(resolve => setTimeout(resolve, 800))

        const found = mockStaff.find(s => s.activation_code === code && !s.business_id)

        if (found) {
            setFormData({
                activation_code: found.activation_code,
                business_id: 0,
                name: found.name,
                username: found.username,
                first_name: found.first_name,
                last_name: found.last_name,
                telegram_id: found.telegram_id,
                role: 'cashier',
                is_active: true
            })
        } else {
            setCodeError('Кассир с таким кодом не найден или уже привязан')
        }

        setIsLoading(false)
    }

    const handleAddStaff = () => {
        setEditingStaff(null)
        setFormData({
            activation_code: '',
            business_id: 0,
            name: '',
            username: '',
            first_name: '',
            last_name: '',
            telegram_id: 0,
            role: 'cashier',
            is_active: true
        })
        setCodeError('')
        setIsModalOpen(true)
    }

    const handleEditStaff = (staff: Staff) => {
        setEditingStaff(staff)
        setFormData({
            activation_code: staff.activation_code,
            business_id: staff.business_id,
            name: staff.name,
            username: staff.username,
            first_name: staff.first_name,
            last_name: staff.last_name,
            telegram_id: staff.telegram_id,
            role: staff.role,
            is_active: staff.is_active
        })
        setIsModalOpen(true)
    }

    const handleDeleteStaff = (id: number) => {
        if (!confirm('Вы уверены, что хотите удалить этого кассира?')) return

        setStaffList(staffList.filter(s => s.id !== id))
        alert('Кассир успешно удалён!')
    }

    // Переключение статуса кассира БЕЗ алерта
    const handleToggleActive = (staff: Staff) => {
        const updatedStaff = { ...staff, is_active: !staff.is_active }
        setStaffList(staffList.map(s => s.id === staff.id ? updatedStaff : s))

        // TODO: Отправить запрос на бэкенд для обновления статуса
        // Например: await adminApi.toggleStaffActive(staff.id, updatedStaff.is_active)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.business_id) {
            alert('Пожалуйста, выберите заведение')
            return
        }

        if (editingStaff) {
            setStaffList(staffList.map(s =>
                s.id === editingStaff.id ? { ...s, ...formData, business_name: venues.find(v => v.id === formData.business_id)?.name || '' } : s
            ))
            alert('Кассир успешно обновлён!')
        } else {
            const newStaff: Staff = {
                id: staffList.length + 1,
                ...formData,
                business_name: venues.find(v => v.id === formData.business_id)?.name || '',
                created_at: new Date().toISOString(),
                last_active: null
            }
            setStaffList([...staffList, newStaff])
            alert('Кассир успешно привязан к заведению!')
        }

        setIsModalOpen(false)
    }

    // Переключение развёрнутого состояния заведения
    const toggleVenue = (venueId: number) => {
        setExpandedVenues(prev =>
            prev.includes(venueId)
                ? prev.filter(id => id !== venueId)
                : [...prev, venueId]
        )
    }

    // Фильтрация кассиров
    const filteredStaff = staffList.filter(staff => {
        const matchesSearch =
            staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.business_name.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus =
            filterStatus === 'all' ||
            (filterStatus === 'active' && staff.is_active) ||
            (filterStatus === 'inactive' && !staff.is_active)

        return matchesSearch && matchesStatus
    })

    // Группируем отфильтрованных кассиров
    const filteredGroupedStaff = venues.map(venue => ({
        venue,
        staff: filteredStaff.filter(s => s.business_id === venue.id)
    })).filter(group => group.staff.length > 0)

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', padding: '32px' }}>
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
                        <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <div>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: 'bold',
                            color: COLORS.text,
                            margin: 0,
                            marginBottom: '4px'
                        }}>
                            Персонал
                        </h1>
                        <p style={{ color: '#666', fontSize: '14px' }}>
                            Управление кассирами по заведениям
                        </p>
                    </div>
                </div>

                {/* Фильтры и поиск */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => setFilterStatus('all')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: filterStatus === 'all' ? COLORS.primary : '#f5f5f5',
                                color: filterStatus === 'all' ? 'white' : '#666',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            Все
                        </button>
                        <button
                            onClick={() => setFilterStatus('active')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: filterStatus === 'active' ? '#e8f5e9' : '#f5f5f5',
                                color: filterStatus === 'active' ? '#2e7d32' : '#666',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '4px' }} />
                            Активные
                        </button>
                        <button
                            onClick={() => setFilterStatus('inactive')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: filterStatus === 'inactive' ? '#ffebee' : '#f5f5f5',
                                color: filterStatus === 'inactive' ? '#c62828' : '#666',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            <FontAwesomeIcon icon={faClock} style={{ marginRight: '4px' }} />
                            Неактивные
                        </button>
                    </div>

                    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <FontAwesomeIcon
                            icon={faSearch}
                            style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#999'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Поиск по имени или нику..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px 12px 48px',
                                border: `1px solid ${COLORS.border}`,
                                borderRadius: '12px',
                                fontSize: '14px',
                                color: COLORS.text
                            }}
                        />
                    </div>

                    <button
                        onClick={handleAddStaff}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: COLORS.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryDark}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Добавить кассира</span>
                    </button>
                </div>
            </div>

            {/* Список кассиров сгруппированный по заведениям */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredGroupedStaff.length === 0 ? (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        border: `1px solid ${COLORS.border}`,
                        padding: '64px 32px',
                        textAlign: 'center',
                        color: '#999'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>👥</div>
                        <p style={{ fontSize: '16px', marginBottom: '8px' }}>Нет кассиров</p>
                        <p style={{ fontSize: '14px' }}>Добавьте первого кассира по коду активации</p>
                    </div>
                ) : (
                    filteredGroupedStaff.map((group) => (
                        <div
                            key={group.venue.id}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                border: `1px solid ${COLORS.border}`,
                                overflow: 'hidden'
                            }}
                        >
                            {/* Заголовок заведения - УПРОЩЁННЫЙ */}
                            <div
                                onClick={() => toggleVenue(group.venue.id)}
                                style={{
                                    padding: '16px 24px',
                                    backgroundColor: '#f9fafb',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderBottom: expandedVenues.includes(group.venue.id) ? `1px solid ${COLORS.border}` : 'none',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <FontAwesomeIcon icon={faStore} color={COLORS.primary} size="lg" />
                                    <div>
                                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: COLORS.text, margin: 0 }}>
                                            {group.venue.name}
                                        </h3>
                                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                                            {group.staff.length} кассир{group.staff.length === 1 ? '' : group.staff.length < 5 ? 'а' : 'ов'}
                                        </p>
                                    </div>
                                </div>
                                {/* УБРАНА СТАТИСТИКА АКТИВНЫХ/НЕАКТИВНЫХ */}
                                <FontAwesomeIcon
                                    icon={expandedVenues.includes(group.venue.id) ? faChevronUp : faChevronDown}
                                    color={COLORS.primary}
                                    size="lg"
                                />
                            </div>

                            {/* Список кассиров */}
                            {expandedVenues.includes(group.venue.id) && (
                                <div>
                                    {group.staff.length === 0 ? (
                                        <div style={{
                                            padding: '32px',
                                            textAlign: 'center',
                                            color: '#999'
                                        }}>
                                            <p style={{ fontSize: '14px' }}>В этом заведении пока нет кассиров</p>
                                        </div>
                                    ) : (
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ backgroundColor: '#fafafa' }}>
                                                    <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: '600', color: '#666', fontSize: '13px', textTransform: 'uppercase' }}>Кассир</th>
                                                    <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: '600', color: '#666', fontSize: '13px', textTransform: 'uppercase' }}>Telegram</th>
                                                    <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: '600', color: '#666', fontSize: '13px', textTransform: 'uppercase' }}>Статус</th>
                                                    <th style={{ padding: '12px 24px', textAlign: 'right', fontWeight: '600', color: '#666', fontSize: '13px', textTransform: 'uppercase' }}>Действия</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {group.staff.map((staff) => (
                                                    <tr
                                                        key={staff.id}
                                                        style={{
                                                            borderBottom: `1px solid ${COLORS.border}`,
                                                            transition: 'background-color 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                                    >
                                                        <td style={{ padding: '16px 24px', fontWeight: '600', color: COLORS.text }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <div style={{
                                                                    width: '32px',
                                                                    height: '32px',
                                                                    backgroundColor: COLORS.primary + '15',
                                                                    borderRadius: '8px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    fontSize: '16px',
                                                                    color: COLORS.primary
                                                                }}>
                                                                    <FontAwesomeIcon icon={faUser} />
                                                                </div>
                                                                <span>{staff.name}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '16px 24px', color: '#666' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                <FontAwesomeIcon icon={faPaperPlane} color="#0088cc" size="sm" />
                                                                <span>{staff.username}</span>
                                                            </div>
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding: '16px 24px',
                                                                cursor: 'pointer',
                                                                transition: 'background-color 0.2s'
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleToggleActive(staff)
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                        >
                                                            {staff.is_active ? (
                                                                <span style={{
                                                                    padding: '6px 16px',
                                                                    borderRadius: '20px',
                                                                    fontSize: '13px',
                                                                    fontWeight: '600',
                                                                    backgroundColor: '#e8f5e9',
                                                                    color: '#2e7d32',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: '8px',
                                                                    transition: 'all 0.2s'
                                                                }}>
                                                                    <FontAwesomeIcon icon={faCheckCircle} />
                                                                    <span>Активен</span>
                                                                </span>
                                                            ) : (
                                                                <span style={{
                                                                    padding: '6px 16px',
                                                                    borderRadius: '20px',
                                                                    fontSize: '13px',
                                                                    fontWeight: '600',
                                                                    backgroundColor: '#ffebee',
                                                                    color: '#c62828',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: '8px',
                                                                    transition: 'all 0.2s'
                                                                }}>
                                                                    <FontAwesomeIcon icon={faClock} />
                                                                    <span>Неактивен</span>
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                                <button
                                                                    onClick={() => handleEditStaff(staff)}
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
                                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#bbdefb'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e3f2fd'}
                                                                    title="Редактировать"
                                                                >
                                                                    <FontAwesomeIcon icon={faPen} size="sm" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteStaff(staff.id)}
                                                                    style={{
                                                                        width: '32px',
                                                                        height: '32px',
                                                                        borderRadius: '8px',
                                                                        border: 'none',
                                                                        backgroundColor: '#ffebee',
                                                                        color: '#c62828',
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        transition: 'all 0.2s'
                                                                    }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffcdd2'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffebee'}
                                                                    title="Удалить"
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} size="sm" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Модальное окно */}
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
                            {editingStaff ? 'Редактировать кассира' : 'Добавить кассира по коду'}
                        </h2>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {!editingStaff ? (
                                <>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                                            Код активации <span style={{ color: COLORS.primary }}>*</span>
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                value={formData.activation_code}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '')
                                                    setFormData({ ...formData, activation_code: value.slice(0, 6) })
                                                    if (value.length === 6) {
                                                        searchStaffByCode(value)
                                                    }
                                                }}
                                                placeholder="Введите 6-значный код"
                                                maxLength={6}
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '14px 16px',
                                                    border: codeError ? `1px solid #c62828` : `1px solid ${COLORS.border}`,
                                                    borderRadius: '12px',
                                                    fontSize: '16px',
                                                    color: COLORS.text
                                                }}
                                            />
                                            {isLoading && (
                                                <div style={{
                                                    position: 'absolute',
                                                    right: '16px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    width: '20px',
                                                    height: '20px',
                                                    border: '2px solid #ccc',
                                                    borderTop: `2px solid ${COLORS.primary}`,
                                                    borderRadius: '50%',
                                                    animation: 'spin 1s linear infinite'
                                                }} />
                                            )}
                                        </div>
                                        {codeError && (
                                            <p style={{ color: '#c62828', fontSize: '12px', marginTop: '6px' }}>
                                                {codeError}
                                            </p>
                                        )}
                                        <p style={{ color: '#666', fontSize: '12px', marginTop: '6px' }}>
                                            Кассир получает код в своём приложении Telegram
                                        </p>
                                    </div>

                                    {formData.name && (
                                        <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '12px' }}>
                                            <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                                                Найден кассир:
                                            </p>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                <div>
                                                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Имя</p>
                                                    <p style={{ fontSize: '14px', fontWeight: '600', color: COLORS.text }}>{formData.name}</p>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Telegram</p>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <FontAwesomeIcon icon={faPaperPlane} color="#0088cc" size="sm" />
                                                        <span style={{ fontSize: '14px', fontWeight: '600', color: COLORS.text }}>{formData.username}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '12px' }}>
                                    <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                                        Кассир:
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Имя</p>
                                            <p style={{ fontSize: '14px', fontWeight: '600', color: COLORS.text }}>{formData.name}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Telegram</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <FontAwesomeIcon icon={faPaperPlane} color="#0088cc" size="sm" />
                                                <span style={{ fontSize: '14px', fontWeight: '600', color: COLORS.text }}>{formData.username}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Простое отображение статуса */}
                                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${COLORS.border}` }}>
                                        <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Статус</p>
                                        {formData.is_active ? (
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                backgroundColor: '#e8f5e9',
                                                color: '#2e7d32',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                <FontAwesomeIcon icon={faCheckCircle} />
                                                <span>Активен</span>
                                            </span>
                                        ) : (
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                backgroundColor: '#ffebee',
                                                color: '#c62828',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                <FontAwesomeIcon icon={faClock} />
                                                <span>Неактивен</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                                    Заведение <span style={{ color: COLORS.primary }}>*</span>
                                </label>
                                <select
                                    value={formData.business_id}
                                    onChange={(e) => setFormData({ ...formData, business_id: parseInt(e.target.value) })}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: `1px solid ${COLORS.border}`,
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        color: COLORS.text,
                                        backgroundColor: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value={0}>Выберите заведение</option>
                                    {venues.map((venue) => (
                                        <option key={venue.id} value={venue.id}>
                                            {venue.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                <button
                                    type="submit"
                                    disabled={isLoading || (!editingStaff && !formData.name)}
                                    style={{
                                        flex: 1,
                                        padding: '14px 24px',
                                        backgroundColor: (isLoading || (!editingStaff && !formData.name)) ? '#ccc' : COLORS.primary,
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '14px',
                                        cursor: (isLoading || (!editingStaff && !formData.name)) ? 'not-allowed' : 'pointer',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isLoading && (editingStaff || formData.name)) {
                                            e.currentTarget.style.backgroundColor = COLORS.primaryDark
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isLoading && (editingStaff || formData.name)) {
                                            e.currentTarget.style.backgroundColor = COLORS.primary
                                        }
                                    }}
                                >
                                    {editingStaff ? 'Сохранить изменения' : 'Привязать к заведению'}
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