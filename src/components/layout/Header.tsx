import { COLORS } from '../../pages/Landing'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px 40px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      marginLeft: '260px'
    }}>
      <h1 style={{
        color: COLORS.primary,
        margin: 0,
        fontSize: '28px',
        fontWeight: 'bold'
      }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{
          color: '#666',
          margin: '5px 0 0 0',
          fontSize: '14px'
        }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
