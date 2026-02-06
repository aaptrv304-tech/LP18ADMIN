import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { adminApi } from '../../services/api'
import { COLORS } from '../../pages/Landing'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface ChartDataPoint {
  date: string
  visits: number
}

interface VisitsChartProps {
  businessId: number
  totalVisits: number
}

export default function VisitsChart({ businessId, totalVisits }: VisitsChartProps) {
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (totalVisits === 0) {
      setLoading(false)
      return
    }
    fetchChartData()
  }, [businessId, totalVisits])

  const fetchChartData = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getVisitsChartData(businessId, 14)

      const apiData: { date: string; visits: number }[] = response.data.data || []

      // Форматируем даты для отображения
      const formattedData = apiData.map(item => ({
        date: new Date(item.date).toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: 'short'
        }),
        visits: item.visits
      }))

      setChartData(formattedData)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching chart data:', err)
      setError(err.response?.data?.message || 'Ошибка загрузки данных для графика')

      // В случае ошибки показываем пустой график
      setChartData([])
    } finally {
      setLoading(false)
    }
  }

  // Если нет посещений - показываем заглушку
  if (totalVisits === 0) {
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
          backgroundColor: COLORS.primary + '15',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <FontAwesomeIcon icon={faChartLine} style={{ fontSize: '48px', color: COLORS.primary }} />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text, marginBottom: '8px' }}>
          Нет данных для графика
        </h3>
        <p style={{ color: '#999', fontSize: '14px', lineHeight: '1.5' }}>
          График посещений появится после первых визитов клиентов
        </p>
      </div>
    )
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
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <p style={{ color: '#999', fontSize: '14px' }}>Загрузка графика...</p>
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

  // Если данных нет (но totalVisits > 0) - показываем пустой график
  if (chartData.length === 0) {
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
          backgroundColor: COLORS.primary + '15',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <FontAwesomeIcon icon={faChartLine} style={{ fontSize: '48px', color: COLORS.primary }} />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text, marginBottom: '8px' }}>
          Нет данных за период
        </h3>
        <p style={{ color: '#999', fontSize: '14px', lineHeight: '1.5' }}>
          Данные за последние 14 дней отсутствуют
        </p>
      </div>
    )
  }

  // Подготовка данных для графика
  const chartConfig = {
    labels: chartData.map(item => item.date),
    datasets: [
      {
        label: 'Посещений',
        data: chartData.map(item => item.visits),
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '15',
        borderWidth: 3,
        pointBackgroundColor: COLORS.primary,
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.4,
        cubicInterpolationMode: 'monotone' as const,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: COLORS.primary,
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => {
            return `Посещений: ${context.raw}`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0',
        },
        ticks: {
          color: '#666',
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#666',
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  }

  // Статистика для графика
  const totalVisitsPeriod = chartData.reduce((sum, item) => sum + item.visits, 0)
  const avgVisits = Math.round(totalVisitsPeriod / chartData.length)
  const maxVisits = Math.max(...chartData.map(item => item.visits))
  const maxDay = chartData.find(item => item.visits === maxVisits)?.date

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      border: `1px solid ${COLORS.border}`,
      padding: '32px',
    }}>
      {/* Заголовок */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: COLORS.primary + '15',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: COLORS.primary
          }}>
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: COLORS.text,
            margin: 0
          }}>
            График посещений за 2 недели
          </h2>
        </div>

        {/* Статистика */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '16px',
          marginTop: '16px'
        }}>
          <StatItem label="Всего" value={totalVisitsPeriod.toString()} color={COLORS.primary} />
          <StatItem label="Среднее" value={`${avgVisits}/день`} color="#4CAF50" />
          <StatItem label="Максимум" value={`${maxVisits}`} color="#FF9800" />
          <StatItem label="Пик" value={maxDay || '-'} color="#9C27B0" />
        </div>
      </div>

      {/* График */}
      <div style={{ height: '320px', position: 'relative' }}>
        <Line data={chartConfig} options={options} />
      </div>
    </div>
  )
}

function StatItem({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div style={{
      padding: '12px',
      backgroundColor: `${color}10`,
      borderRadius: '10px',
      border: `1px solid ${color}20`
    }}>
      <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '18px', fontWeight: 'bold', color: color }}>{value}</div>
    </div>
  )
}
