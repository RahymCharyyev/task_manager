import { Navigate, Outlet } from 'react-router-dom'
import { authStore } from '../stores/authStore'

export function ProtectedRoute() {
  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}
