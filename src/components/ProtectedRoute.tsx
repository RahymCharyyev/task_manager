import { Navigate, Outlet } from 'react-router-dom';
import { authStore } from '../stores';

export function ProtectedRoute() {
  if (!authStore.isAuthenticated) {
    return <Navigate to='/login' replace />;
  }
  return <Outlet />;
}
