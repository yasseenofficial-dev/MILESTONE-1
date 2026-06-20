import { Navigate, Outlet } from 'react-router-dom';
import { useOrganizerAuth } from '../../context/OrganizerAuthContext.jsx';
import OrganizerLayout from './Layout.jsx';
import { Loading } from './ui.jsx';

export default function OrganizerProtectedRoute() {
  const { isAuthenticated, loading } = useOrganizerAuth();
  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <OrganizerLayout><Outlet /></OrganizerLayout>;
}
