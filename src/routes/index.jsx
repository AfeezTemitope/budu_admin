import { useRoutes, Navigate } from 'react-router-dom'
import { authService } from '../api'
import AdminLayout from '../components/layout/AdminLayout'
import LoginPage from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import PlayersList from '../pages/Players'
import PlayerDetail from '../pages/Players/PlayerDetail'
import RegisterPlayer from '../pages/Players/RegisterPlayer'
import SchedulePage from '../pages/Schedule'
import NewsPage from '../pages/News'
import StorePage from '../pages/Store'
import SettingsPage from '../pages/Settings'

function ProtectedRoute({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

function GuestRoute({ children }) {
  if (authService.isAuthenticated()) {
    return <Navigate to="/" replace />
  }
  return children
}

export default function AppRoutes() {
  return useRoutes([
    {
      path: '/login',
      element: (
        <GuestRoute>
          <LoginPage />
        </GuestRoute>
      ),
    },
    {
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: '/', element: <Dashboard /> },
        { path: '/players', element: <PlayersList /> },
        { path: '/players/register', element: <RegisterPlayer /> },
        { path: '/players/:id', element: <PlayerDetail /> },
        { path: '/schedule', element: <SchedulePage /> },
        { path: '/news', element: <NewsPage /> },
        { path: '/store', element: <StorePage /> },
        { path: '/settings', element: <SettingsPage /> },
      ],
    },
    { path: '*', element: <Navigate to="/" replace /> },
  ])
}
