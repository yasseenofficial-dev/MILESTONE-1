import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Layout() {
  const { owner, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">PopEyez</div>
        <div className="brand-sub">Venue Owner Portal</div>
        <nav>
          <NavLink to="/listings" className={({ isActive }) => (isActive ? "active" : "")}>
            My Listings
          </NavLink>
          <NavLink to="/requests" className={({ isActive }) => (isActive ? "active" : "")}>
            Booking Requests
          </NavLink>
          <NavLink to="/bookings" className={({ isActive }) => (isActive ? "active" : "")}>
            Bookings Overview
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => (isActive ? "active" : "")}>
            Performance & Reports
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
            Profile
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="owner-name">{owner?.ownerName}</div>
          <button className="btn-link" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
