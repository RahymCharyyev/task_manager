import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { TaskDetailPage } from '../pages/TaskDetailPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path='tasks/:id' element={<TaskDetailPage />} />
          </Route>
        </Route>
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}
