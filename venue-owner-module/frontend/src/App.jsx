import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Layout from "./components/Layout.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ListingsPage from "./pages/ListingsPage.jsx";
import ListingDetailPage from "./pages/ListingDetailPage.jsx";
import NewListingPage from "./pages/NewListingPage.jsx";
import BookingRequestsPage from "./pages/BookingRequestsPage.jsx";
import BookingsOverviewPage from "./pages/BookingsOverviewPage.jsx";
import ReportingPage from "./pages/ReportingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

function PrivateRoute({ children }) {
  const { owner, loading } = useAuth();
  if (loading) return <div className="page-loading">Loading...</div>;
  if (!owner) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/listings" replace />} />
        <Route path="listings" element={<ListingsPage />} />
        <Route path="listings/new" element={<NewListingPage />} />
        <Route path="listings/:id" element={<ListingDetailPage />} />
        <Route path="requests" element={<BookingRequestsPage />} />
        <Route path="bookings" element={<BookingsOverviewPage />} />
        <Route path="reports" element={<ReportingPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
