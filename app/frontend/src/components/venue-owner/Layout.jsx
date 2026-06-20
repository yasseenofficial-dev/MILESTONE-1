import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useVenueOwnerAuth } from '../../context/VenueOwnerAuthContext.jsx';

export default function VenueOwnerLayout() {
  const { owner, logout } = useVenueOwnerAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">PopEyez</div>
        <div className="brand-sub">Venue Owner Portal</div>
        <nav>
          {[
            ['/venue-owner/listings', 'My Listings'],
            ['/venue-owner/requests', 'Booking Requests'],
            ['/venue-owner/bookings', 'Bookings Overview'],
            ['/venue-owner/reports', 'Performance & Reports'],
            ['/venue-owner/profile', 'Profile'],
          ].map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="owner-name">{owner?.ownerName}</div>
          <button className="btn-link" onClick={logout}>Log out</button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
