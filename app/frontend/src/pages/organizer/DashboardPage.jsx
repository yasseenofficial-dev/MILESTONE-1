import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventApi, taskApi } from '../../api/index.js';
import { Loading, StatusBadge } from '../../components/organizer/ui.jsx';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventApi.getDashboard()
      .then((res) => setData(res.data.data || res.data))
      .catch(() => setData({ stats: { totalEvents:0, upcomingEvents:0, pendingBookings:0, avgFeedbackRating:0, rsvpStats:{} }, recentEvents:[], upcomingTasks:[], recentFeedback:[] }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const { stats = {}, recentEvents = [], upcomingTasks = [], recentFeedback = [] } = data || {};

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <Link to="/events/new" className="btn btn-primary">+ New Event</Link>
      </div>
      <div className="stats-grid">
        <div className="stat-card primary"><div className="label">Total Events</div><div className="value">{stats.totalEvents}</div></div>
        <div className="stat-card"><div className="label">Upcoming</div><div className="value">{stats.upcomingEvents}</div></div>
        <div className="stat-card"><div className="label">Pending Bookings</div><div className="value">{stats.pendingBookings}</div></div>
        <div className="stat-card"><div className="label">Avg Feedback</div><div className="value">{stats.avgFeedbackRating} ★</div></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-title">Recent Events</div>
          {recentEvents.length === 0 ? <p className="empty-state">No events yet</p> : (
            <table>
              <thead><tr><th>Event</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {recentEvents.map((e) => (
                  <tr key={e.id}>
                    <td><Link to={`/events/${e.id}`}>{e.title}</Link></td>
                    <td>{new Date(e.startDate).toLocaleDateString()}</td>
                    <td><StatusBadge status={e.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="card">
          <div className="card-title">Upcoming Tasks & Reminders</div>
          {upcomingTasks.length === 0 ? <p className="empty-state">No pending tasks</p> : (
            <table>
              <thead><tr><th>Task</th><th>Event</th><th>Due</th></tr></thead>
              <tbody>
                {upcomingTasks.map((t) => (
                  <tr key={t.id}>
                    <td>{t.title}</td><td>{t.event?.title}</td>
                    <td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-title">RSVP Summary</div>
        <div className="stats-grid">
          {Object.entries(stats.rsvpStats || {}).map(([status, count]) => (
            <div key={status} className="stat-card">
              <div className="label">{status}</div><div className="value" style={{ fontSize: '1.5rem' }}>{count}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-title">Recent Feedback</div>
        {recentFeedback.length === 0 ? <p className="empty-state">No feedback yet</p> : (
          <table>
            <thead><tr><th>Event</th><th>Rating</th><th>Comment</th></tr></thead>
            <tbody>
              {recentFeedback.map((f) => (
                <tr key={f.id}><td>{f.event?.title}</td><td>{'★'.repeat(f.rating)}</td><td>{f.comment || '—'}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
