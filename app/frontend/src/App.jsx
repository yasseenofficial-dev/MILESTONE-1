import { Routes, Route, Navigate } from 'react-router-dom';
import { useOrganizerAuth } from './context/OrganizerAuthContext.jsx';
import { Loading } from './components/organizer/ui.jsx';

// ── Organizer (YS) ─────────────────────────────────────────────────────────
import OrganizerProtectedRoute from './components/organizer/ProtectedRoute.jsx';
import OrganizerLoginPage    from './pages/organizer/LoginPage.jsx';
import OrganizerRegisterPage from './pages/organizer/RegisterPage.jsx';
import DashboardPage         from './pages/organizer/DashboardPage.jsx';
import EventsPage            from './pages/organizer/EventsPage.jsx';
import EventFormPage         from './pages/organizer/EventFormPage.jsx';
import EventDetailPage       from './pages/organizer/EventDetailPage.jsx';
import VenuesPage            from './pages/organizer/VenuesPage.jsx';
import BookingsPage          from './pages/organizer/BookingsPage.jsx';
import StakeholdersPage      from './pages/organizer/StakeholdersPage.jsx';
import TasksPage             from './pages/organizer/TasksPage.jsx';
import BudgetPage            from './pages/organizer/BudgetPage.jsx';
import FloorPlansPage, { FloorPlanDesignerPage } from './pages/organizer/FloorPlansPage.jsx';
import StaffPage             from './pages/organizer/StaffPage.jsx';
import VendorsPage           from './pages/organizer/VendorsPage.jsx';
import GuestsPage            from './pages/organizer/GuestsPage.jsx';
import AccountsPage          from './pages/organizer/AccountsPage.jsx';

// ── Guest Portal ───────────────────────────────────────────────────────────
import GuestLoginPage       from './pages/guest/GuestLoginPage.jsx';
import GuestPortalPage      from './pages/guest/GuestPortalPage.jsx';
import GuestInvitationPage  from './pages/guest/GuestInvitationPage.jsx';
import GuestRSVPPage        from './pages/guest/GuestRSVPPage.jsx';
import GuestMessagesPage    from './pages/guest/GuestMessagesPage.jsx';
import GuestCheckInPage     from './pages/guest/GuestCheckInPage.jsx';
import GuestFeedbackPage    from './pages/guest/GuestFeedbackPage.jsx';
import GuestProtectedRoute  from './components/guest/GuestProtectedRoute.jsx';

// ── Day-of Operations (Youssef ElDairy) ────────────────────────────────────
import DayofLoginPage            from './pages/dayof/LoginPage.jsx';
import OrganizerDashboardPage    from './pages/dayof/OrganizerDashboardPage.jsx';
import CommunicationsPage        from './pages/dayof/CommunicationsPage.jsx';
import ReportsPage               from './pages/dayof/ReportsPage.jsx';
import StaffEventsPage           from './pages/dayof/StaffEventsPage.jsx';
import StaffTasksPage            from './pages/dayof/StaffTasksPage.jsx';
import FloorPlanPage             from './pages/dayof/FloorPlanPage.jsx';
import DayofGuestCheckInPage     from './pages/dayof/GuestCheckInPage.jsx';
import VendorArrivalPage         from './pages/dayof/VendorArrivalPage.jsx';

// ── Venue Owner ────────────────────────────────────────────────────────────
import VenueOwnerLoginPage    from './pages/venue-owner/LoginPage.jsx';
import VenueOwnerRegisterPage from './pages/venue-owner/RegisterPage.jsx';
import ListingsPage           from './pages/venue-owner/ListingsPage.jsx';
import NewListingPage         from './pages/venue-owner/NewListingPage.jsx';
import ListingDetailPage      from './pages/venue-owner/ListingDetailPage.jsx';
import BookingRequestsPage    from './pages/venue-owner/BookingRequestsPage.jsx';
import BookingsOverviewPage   from './pages/venue-owner/BookingsOverviewPage.jsx';
import VenueOwnerReportingPage from './pages/venue-owner/ReportingPage.jsx';
import ProfilePage            from './pages/venue-owner/ProfilePage.jsx';

// ── Alaa (Client / Vendor Sourcing) ────────────────────────────────────────
import ClientEventsPage      from './pages/alaa/ClientEventsPage.jsx';
import ClientRequestsPage    from './pages/alaa/ClientRequestsPage.jsx';
import ClientDeliveriesPage  from './pages/alaa/ClientDeliveriesPage.jsx';
import ClientInvoicesPage    from './pages/alaa/ClientInvoicesPage.jsx';
import VendorLoginPage       from './pages/alaa/VendorLoginPage.jsx';
import VendorRequestsPage    from './pages/alaa/VendorRequestsPage.jsx';
import VendorDeliveriesPage  from './pages/alaa/VendorDeliveriesPage.jsx';

// ── Homepage ───────────────────────────────────────────────────────────────
import MainHomePage from './pages/MainHomePage.jsx';

function App() {
  const { loading } = useOrganizerAuth();
  if (loading) return <Loading />;

  return (
    <Routes>
      {/* ── Root ─────────────────────────────────────────────────────── */}
      <Route path="/" element={<MainHomePage />} />

      {/* ── YS Event Organizer ──────────────────────────────────────── */}
      <Route path="/login"    element={<OrganizerLoginPage />} />
      <Route path="/register" element={<OrganizerRegisterPage />} />
      <Route element={<OrganizerProtectedRoute />}>
        <Route path="/dashboard"                                   element={<DashboardPage />} />
        <Route path="/events"                                      element={<EventsPage />} />
        <Route path="/events/new"                                  element={<EventFormPage />} />
        <Route path="/events/:eventId"                             element={<EventDetailPage />} />
        <Route path="/events/:eventId/edit"                        element={<EventFormPage />} />
        <Route path="/events/:eventId/stakeholders"                element={<StakeholdersPage />} />
        <Route path="/events/:eventId/tasks"                       element={<TasksPage />} />
        <Route path="/events/:eventId/budget"                      element={<BudgetPage />} />
        <Route path="/events/:eventId/floor-plans"                 element={<FloorPlansPage />} />
        <Route path="/events/:eventId/floor-plans/:planId"         element={<FloorPlanDesignerPage />} />
        <Route path="/events/:eventId/staff"                       element={<StaffPage />} />
        <Route path="/events/:eventId/vendors"                     element={<VendorsPage />} />
        <Route path="/events/:eventId/guests"                      element={<GuestsPage />} />
        <Route path="/venues"                                      element={<VenuesPage />} />
        <Route path="/bookings"                                    element={<BookingsPage />} />
        <Route path="/accounts"                                    element={<AccountsPage />} />
      </Route>

      {/* ── Guest Portal (login-protected) ──────────────────────────── */}
      <Route path="/guest/login" element={<GuestLoginPage />} />
      <Route element={<GuestProtectedRoute />}>
        <Route path="/guest"              element={<GuestPortalPage />} />
        <Route path="/guest/invitation"   element={<GuestInvitationPage />} />
        <Route path="/guest/rsvp"         element={<GuestRSVPPage />} />
        <Route path="/guest/messages"     element={<GuestMessagesPage />} />
        <Route path="/guest/check-in"     element={<GuestCheckInPage />} />
        <Route path="/guest/feedback"     element={<GuestFeedbackPage />} />
      </Route>

      {/* ── Day-of Operations ────────────────────────────────────────── */}
      <Route path="/dayof/login"              element={<DayofLoginPage />} />
      <Route path="/dayof/organizer"          element={<OrganizerDashboardPage />} />
      <Route path="/dayof/communications"     element={<CommunicationsPage />} />
      <Route path="/dayof/reports"            element={<ReportsPage />} />
      <Route path="/dayof/staff/events"       element={<StaffEventsPage />} />
      <Route path="/dayof/staff/tasks"        element={<StaffTasksPage />} />
      <Route path="/dayof/floor-plan"         element={<FloorPlanPage />} />
      <Route path="/dayof/guest-check-in"     element={<DayofGuestCheckInPage />} />
      <Route path="/dayof/vendor-arrival"     element={<VendorArrivalPage />} />

      {/* ── Venue Owner ─────────────────────────────────────────────── */}
      <Route path="/venue-owner/login"            element={<VenueOwnerLoginPage />} />
      <Route path="/venue-owner/register"         element={<VenueOwnerRegisterPage />} />
      <Route path="/venue-owner/listings"         element={<ListingsPage />} />
      <Route path="/venue-owner/listings/new"     element={<NewListingPage />} />
      <Route path="/venue-owner/listings/:id"     element={<ListingDetailPage />} />
      <Route path="/venue-owner/booking-requests" element={<BookingRequestsPage />} />
      <Route path="/venue-owner/bookings"         element={<BookingsOverviewPage />} />
      <Route path="/venue-owner/reporting"        element={<VenueOwnerReportingPage />} />
      <Route path="/venue-owner/profile"          element={<ProfilePage />} />

      {/* ── Alaa – Client ────────────────────────────────────────────── */}
      <Route path="/client/events"      element={<ClientEventsPage />} />
      <Route path="/client/requests"    element={<ClientRequestsPage />} />
      <Route path="/client/deliveries"  element={<ClientDeliveriesPage />} />
      <Route path="/client/invoices"    element={<ClientInvoicesPage />} />

      {/* ── Alaa – Vendor ────────────────────────────────────────────── */}
      <Route path="/vendor/login"       element={<VendorLoginPage />} />
      <Route path="/vendor/requests"    element={<VendorRequestsPage />} />
      <Route path="/vendor/deliveries"  element={<VendorDeliveriesPage />} />

      {/* ── Fallback ─────────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
