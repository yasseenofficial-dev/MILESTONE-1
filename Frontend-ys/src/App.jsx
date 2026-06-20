import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Loading } from './components/ui';

import GuestPortalPage from './pages/GuestPortalPage';
import GuestInvitationPage from './pages/GuestInvitationPage';
import GuestRSVPPage from './pages/GuestRSVPPage';
import GuestMessagesPage from './pages/GuestMessagesPage';
import GuestCheckInPage from './pages/GuestCheckInPage';
import GuestFeedbackPage from './pages/GuestFeedbackPage';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import EventFormPage from './pages/EventFormPage';
import EventDetailPage from './pages/EventDetailPage';
import VenuesPage from './pages/VenuesPage';
import BookingsPage from './pages/BookingsPage';
import StakeholdersPage from './pages/StakeholdersPage';
import TasksPage from './pages/TasksPage';
import BudgetPage from './pages/BudgetPage';
import FloorPlansPage, { FloorPlanDesignerPage } from './pages/FloorPlansPage';
import StaffPage from './pages/StaffPage';
import VendorsPage from './pages/VendorsPage';
import GuestsPage from './pages/GuestsPage';
import AccountsPage from './pages/AccountsPage';

function App() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <Loading />;

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/new" element={<EventFormPage />} />
        <Route path="/events/:eventId" element={<EventDetailPage />} />
        <Route path="/events/:eventId/edit" element={<EventFormPage />} />
        <Route path="/events/:eventId/stakeholders" element={<StakeholdersPage />} />
        <Route path="/events/:eventId/tasks" element={<TasksPage />} />
        <Route path="/events/:eventId/budget" element={<BudgetPage />} />
        <Route path="/events/:eventId/floor-plans" element={<FloorPlansPage />} />
        <Route path="/events/:eventId/floor-plans/:planId" element={<FloorPlanDesignerPage />} />
        <Route path="/events/:eventId/staff" element={<StaffPage />} />
        <Route path="/events/:eventId/vendors" element={<VendorsPage />} />
        <Route path="/events/:eventId/guests" element={<GuestsPage />} />
        <Route path="/venues" element={<VenuesPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
      </Route>

      {/* Guest Portal — public, no auth required */}
      <Route path="/guest" element={<GuestPortalPage />} />
      <Route path="/guest/invitation" element={<GuestInvitationPage />} />
      <Route path="/guest/rsvp" element={<GuestRSVPPage />} />
      <Route path="/guest/messages" element={<GuestMessagesPage />} />
      <Route path="/guest/check-in" element={<GuestCheckInPage />} />
      <Route path="/guest/feedback" element={<GuestFeedbackPage />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
