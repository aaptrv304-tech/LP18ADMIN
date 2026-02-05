import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Venues from './pages/Venues'
import VenuesNew from './pages/VenuesNew'
import VenueDetailPage from './pages/VenueDetail'
import Layout from './components/ui/layout/Layout'

// Защищённый роут
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    console.log('🛡️ ProtectedRoute check - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading)
  }, [isAuthenticated, isLoading])

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fffaf0'
      }}>
        <div style={{ fontSize: '18px', color: '#333333' }}>
          Загрузка...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    console.log('🚫 Not authenticated, redirecting to login')
    return <Navigate to="/login" replace />
  }

  console.log('✅ Authenticated, rendering children')
  return children
}

function App() {
  const { checkAuth, isAuthenticated } = useAuth()

  useEffect(() => {
    console.log('🔄 App: checkAuth called')
    checkAuth()
  }, [checkAuth])

  return (
    <Router>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Защищённые маршруты */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/venues"
          element={
            <ProtectedRoute>
              <Layout>
                <VenuesNew />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/venues-old"
          element={
            <ProtectedRoute>
              <Layout title="🏪 Заведения">
                <Venues />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/venues/:id"
          element={
            <ProtectedRoute>
              <Layout>  {/* ← Убрал title и breadcrumb */}
                <VenueDetailPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* Редирект */}
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />} 
        />
      </Routes>
    </Router>
  )
}

export default App
