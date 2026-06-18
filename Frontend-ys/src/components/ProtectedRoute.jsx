import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Loading } from '../components/ui';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
