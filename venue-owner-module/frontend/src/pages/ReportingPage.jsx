import React, { useEffect, useState } from "react";
import { api, getToken } from "../api.js";

export default function ReportingPage() {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getSummary().then(setSummary).catch((err) => setError(err.message));
    api.getHistory().then(setHistory).catch(() => {});
  }, []);

  async function handleExport() {
    const res = await fetch(api.getExportUrl(), {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "venue-performance-report.json";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  if (error) return <div className="alert error">{error}</div>;
  if (!summary) return <p>Loading report...</p>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Performance & Reporting</h1>
        <button className="btn-primary" onClick={handleExport}>
          Export report
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-value">{summary.totals.totalListings}</span>
          <span className="stat-label">Listings</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{summary.totals.totalBookings}</span>
          <span className="stat-label">Confirmed Bookings</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{summary.totals.totalRequests}</span>
          <span className="stat-label">Total Requests</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{summary.totals.totalRevenue.toLocaleString()}</span>
          <span className="stat-label">Total Revenue (EGP)</span>
        </div>
      </div>

      <h3>Per-listing performance</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Listing</th>
            <th>Bookings</th>
            <th>Requests</th>
            <th>Booking rate</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {summary.perListing.map((p) => (
            <tr key={p.listingId}>
              <td>{p.listingName}</td>
              <td>{p.totalBookings}</td>
              <td>{p.totalRequests}</td>
              <td>{p.bookingRate}%</td>
              <td>
                {p.revenue.toLocaleString()} {p.currency}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Booking history</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Venue</th>
            <th>Event type</th>
            <th>Organizer</th>
          </tr>
        </thead>
        <tbody>
          {history.map((b) => (
            <tr key={b.id}>
              <td>{b.eventDate}</td>
              <td>{b.listingName}</td>
              <td>{b.eventType}</td>
              <td>{b.organizerName}</td>
            </tr>
          ))}
          {history.length === 0 && (
            <tr>
              <td colSpan={4} className="muted">
                No booking history yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
