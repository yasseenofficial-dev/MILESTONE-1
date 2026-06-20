import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import AppLayout from './components/AppLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import OrganizerDashboardPage from './pages/OrganizerDashboardPage.jsx';
import CommunicationsPage from './pages/CommunicationsPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import StaffEventsPage from './pages/StaffEventsPage.jsx';
import StaffTasksPage from './pages/StaffTasksPage.jsx';
import FloorPlanPage from './pages/FloorPlanPage.jsx';
import GuestCheckInPage from './pages/GuestCheckInPage.jsx';
import VendorArrivalPage from './pages/VendorArrivalPage.jsx';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'organizer') return <Navigate to="/organizer/dashboard" replace />;
  return <Navigate to="/staff/events" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<HomeRedirect />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/organizer/dashboard" element={<ProtectedRoute roles={["organizer"]}><OrganizerDashboardPage /></ProtectedRoute>} />
        <Route path="/organizer/communications" element={<ProtectedRoute roles={["organizer"]}><CommunicationsPage /></ProtectedRoute>} />
        <Route path="/organizer/reports" element={<ProtectedRoute roles={["organizer"]}><ReportsPage /></ProtectedRoute>} />
        <Route path="/staff/events" element={<ProtectedRoute roles={["staff"]}><StaffEventsPage /></ProtectedRoute>} />
        <Route path="/staff/tasks" element={<ProtectedRoute roles={["staff"]}><StaffTasksPage /></ProtectedRoute>} />
        <Route path="/staff/floor-plan" element={<ProtectedRoute roles={["staff"]}><FloorPlanPage /></ProtectedRoute>} />
        <Route path="/staff/check-in" element={<ProtectedRoute roles={["staff"]}><GuestCheckInPage /></ProtectedRoute>} />
        <Route path="/staff/vendors" element={<ProtectedRoute roles={["staff"]}><VendorArrivalPage /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
