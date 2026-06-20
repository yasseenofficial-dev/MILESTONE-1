import { Navigate, Outlet } from 'react-router-dom';
import { useGuestAuth } from '../../context/GuestAuthContext.jsx';

export default function GuestProtectedRoute() {
  const { isGuestAuthenticated } = useGuestAuth();
  if (!isGuestAuthenticated) return <Navigate to="/guest/login" replace />;
  return <Outlet />;
}
