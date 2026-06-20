import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import StatusBadge from "../components/StatusBadge.jsx";

export default function BookingsOverviewPage() {
  const [bookings, setBookings] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [filters, setFilters] = useState({ from: "", to: "" });
  const [error, setError] = useState("");

  function load() {
    const params = {};
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;

    api.getBookings(params).then(setBookings).catch((err) => setError(err.message));
    api.getUpcomingBookings().then(setUpcoming).catch(() => {});
  }

  useEffect(load, [filters]);

  return (
    <div className="page">
      <h1>Bookings Overview</h1>

      {error && <div className="alert error">{error}</div>}

      <div className="card">
        <h3>Upcoming confirmed bookings</h3>
        {upcoming.length === 0 && <p className="muted">No upcoming bookings.</p>}
        <ul className="reminder-list">
          {upcoming.map((b) => (
            <li key={b.id}>
              <strong>{b.eventDate}</strong> — {b.eventType} at {b.listingName} ({b.organizerName})
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3>Filter bookings</h3>
        <div className="form-row">
          <div>
            <label>From date</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
            />
          </div>
          <div>
            <label>To date</label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Venue</th>
            <th>Event type</th>
            <th>Organizer</th>
            <th>Contact</th>
            <th>Attendees</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.eventDate}</td>
              <td>{b.listingName}</td>
              <td>{b.eventType}</td>
              <td>{b.organizerName}</td>
              <td>{b.organizerContact}</td>
              <td>{b.expectedAttendees}</td>
              <td>
                <StatusBadge status={b.status} />
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td colSpan={7} className="muted">
                No confirmed bookings found for this range.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
