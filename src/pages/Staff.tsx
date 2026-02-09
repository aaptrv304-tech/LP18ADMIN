import { useState } from 'react'
import { COLORS } from './Landing'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUsers,
    faPlus,
    faPen,
    faTrash,
    faStore,
    faPhone,
    faEnvelope,
    faToggleOn,
    faToggleOff,
    faSearch
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
        phone: '+7 (999) 123-45-67',
        email: 'ivan@example.com',
        role: 'cashier',
        is_active: true,
        business_ids: [1, 2],
        created_at: '2026-01-15T10:00:00Z',
        updated_at: '2026-02-01T14:30:00Z'
    },
    {
        id: 2,
        name: 'Мария Петрова',
        phone: '+7 (999) 234-56-78',
        email: 'maria@example.com',
        role: 'manager',
        is_active: true,
        business_ids: [3],
        created_at: '2026-01-20T11:00:00Z',
        updated_at: '2026-02-05T09:15:00Z'
    },
    {
        id: 3,
        name: 'Алексей Смирнов',
        phone: '+7 (999) 345-67-89',
        email: 'alex@example.com',
        role: 'cashier',
        is_active: false,
        business_ids: [4, 5],
        created_at: '2026-01-25T12:00:00Z',
        updated_at: '2026-02-07T16:45:00Z'
    }
]

interface Staff {
    id: number
    name: string
    phone: string
    email: string
    role: string
    is_active: boolean
    business_ids: number[]
    created_at: string
    updated_at: string
}

export default function StaffPage() {
    const [staffList, setStaffList] = useState<Staff[]>(mockStaff)
    const [venues] = useState(mockVenues)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        role: 'cashier',
        is_active: true,
        business_ids: [] as number[]
    })
    const [searchTerm, setSearchTerm] = useState('')

    const handleAddStaff = () => {
        setEditingStaff(null)
        setFormData({
            name: '',
            phone: '',
            email: '',
            role: 'cashier',
            is_active: true,
            business_ids: []
        })
        setIsModalOpen(true)
    }

    const handleEditStaff = (staff: Staff) => {
        setEditingStaff(staff)
        setFormData({
            name: staff.name,
            phone: staff.phone || '',
            email: staff.email || '',
            role: staff.role,
            is_active: staff.is_active,
            business_ids: staff.business_ids || []
        })
        setIsModalOpen(true)
    }

    const handleDeleteStaff = (id: number) => {
        if (!confirm('Вы уверены, что хотите удалить этого сотрудника?')) return

        setStaffList(staffList.filter(s => s.id !== id))
        alert('Сотрудник успешно удалён!')
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name) {
            alert('Пожалуйста, заполните имя сотрудника')
            return
        }

        if (editingStaff) {
            // Редактирование
            setStaffList(staffList.map(s =>
                s.id === editingStaff.id ? { ...s, ...formData } : s
            ))
            alert('Сотрудник успешно обновлён!')
        } else {
            // Добавление
            const newStaff: Staff = {
                id: staffList.length + 1,
                ...formData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
            setStaffList([...staffList, newStaff])
            alert('Сотрудник успешно добавлен!')
        }

        setIsModalOpen(false)
    }

    const toggleBusiness = (businessId: number) => {
        setFormData(prev => {
            const isSelected = prev.business_ids.includes(businessId)
            return {
                ...prev,
                business_ids: isSelected
                    ? prev.business_ids.filter(id => id !== businessId)
                    : [...prev.business_ids, businessId]
            }
        })
    }

    const filteredStaff = staffList.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (staff.phone && staff.phone.includes(searchTerm)) ||
        (staff.email && staff.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div style={{ marginLeft: '280px', padding: '32px' }}>
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
                            Управление кассирами и сотрудниками заведений
                        </p>
                    </div>
                </div>

                {/* Поиск и кнопка добавления */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                    <div style={{
                        flex: 1,
                        position: 'relative'
                    }}>
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
                            placeholder="Поиск по имени, телефону или email..."
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
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryDark}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Добавить кассира</span>
                    </button>
                </div>
            </div>

            {/* Список сотрудников */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                border: `1px solid ${COLORS.border}`,
                overflow: 'hidden'
            }}>
                {filteredStaff.length === 0 ? (
                    <div style={{
                        padding: '64px 32px',
                        textAlign: 'center',
                        color: '#999'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>👥</div>
                        <p style={{ fontSize: '16px', marginBottom: '8px' }}>Нет сотрудников</p>
                        <p style={{ fontSize: '14px' }}>Добавьте первого кассира</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f9fafb' }}>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', color: '#666', fontSize: '14px' }}>Имя</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', color: '#666', fontSize: '14px' }}>Телефон</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', color: '#666', fontSize: '14px' }}>Email</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', color: '#666', fontSize: '14px' }}>Роль</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', color: '#666', fontSize: '14px' }}>Заведения</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', color: '#666', fontSize: '14px' }}>Статус</th>
                                <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '600', color: '#666', fontSize: '14px' }}>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStaff.map((staff) => (
                                <tr
                                    key={staff.id}
                                    style={{
                                        borderBottom: `1px solid ${COLORS.border}`,
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                >
                                    <td style={{ padding: '16px 24px', fontWeight: '600', color: COLORS.text }}>{staff.name}</td>
                                    <td style={{ padding: '16px 24px', color: '#666' }}>{staff.phone || '—'}</td>
                                    <td style={{ padding: '16px 24px', color: '#666' }}>{staff.email || '—'}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            backgroundColor: staff.role === 'cashier' ? '#e3f2fd' : '#e8f5e9',
                                            color: staff.role === 'cashier' ? '#1976d2' : '#2e7d32'
                                        }}>
                                            {staff.role === 'cashier' ? 'Кассир' : 'Менеджер'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: '#666' }}>
                                        {staff.business_ids && staff.business_ids.length > 0
                                            ? `${staff.business_ids.length} заведений`
                                            : '—'}
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        {staff.is_active ? (
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                backgroundColor: '#e8f5e9',
                                                color: '#2e7d32'
                                            }}>
                                                Активен
                                            </span>
                                        ) : (
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                backgroundColor: '#ffebee',
                                                color: '#c62828'
                                            }}>
                                                Неактивен
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
                            {editingStaff ? 'Редактировать кассира' : 'Добавить кассира'}
                        </h2>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                                    Имя сотрудника <span style={{ color: COLORS.primary }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Иван Иванов"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: `1px solid ${COLORS.border}`,
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        color: COLORS.text
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                                        Телефон
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+7 (999) 123-45-67"
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            border: `1px solid ${COLORS.border}`,
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            color: COLORS.text
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="ivan@example.com"
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            border: `1px solid ${COLORS.border}`,
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            color: COLORS.text
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                                    Роль
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                                    <option value="cashier">Кассир</option>
                                    <option value="manager">Менеджер</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '12px' }}>
                                    Привязать к заведениям
                                </label>
                                <div style={{
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    border: `1px solid ${COLORS.border}`,
                                    borderRadius: '12px',
                                    padding: '12px'
                                }}>
                                    {venues.map((venue) => (
                                        <label
                                            key={venue.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                backgroundColor: formData.business_ids.includes(venue.id) ? '#e3f2fd' : 'transparent',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                            onMouseLeave={(e) => {
                                                if (!formData.business_ids.includes(venue.id)) {
                                                    e.currentTarget.style.backgroundColor = 'transparent'
                                                }
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.business_ids.includes(venue.id)}
                                                onChange={() => toggleBusiness(venue.id)}
                                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                            />
                                            <FontAwesomeIcon icon={faStore} color={COLORS.primary} />
                                            <span style={{ fontSize: '14px', color: COLORS.text }}>{venue.name}</span>
                                        </label>
                                    ))}
                                </div>
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
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryDark}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
                                >
                                    {editingStaff ? 'Сохранить изменения' : 'Добавить кассира'}
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