import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventApi } from '../../api/index.js';
import { Loading, StatusBadge } from '../../components/organizer/ui.jsx';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', eventType: '', search: '' });

  const load = () => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    eventApi.getEvents(params).then((res) => setEvents(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    await eventApi.deleteEvent(id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1>Events</h1>
        <Link to="/events/new" className="btn btn-primary">+ New Event</Link>
      </div>
      <form className="filters-bar card" onSubmit={(e) => { e.preventDefault(); load(); }}>
        <div className="form-group">
          <label>Search</label>
          <input className="form-control" placeholder="Event title..." value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select className="form-control" value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All</option>
            {['DRAFT', 'PLANNING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Type</label>
          <select className="form-control" value={filters.eventType}
            onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}>
            <option value="">All</option>
            {['CONFERENCE', 'GALA', 'PRODUCT_LAUNCH', 'WORKSHOP', 'WEDDING'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-secondary">Filter</button>
      </form>
      {loading ? <Loading /> : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Title</th><th>Type</th><th>Date</th><th>Venue</th><th>Guests</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {events.length === 0 ? <tr><td colSpan={7} className="empty-state">No events found</td></tr>
                  : events.map((e) => (
                    <tr key={e.id}>
                      <td><Link to={`/events/${e.id}`}>{e.title}</Link></td>
                      <td>{e.eventType}</td>
                      <td>{new Date(e.startDate).toLocaleDateString()}</td>
                      <td>{e.venue?.name || '—'}</td>
                      <td>{e._count?.guests || 0}</td>
                      <td><StatusBadge status={e.status} /></td>
                      <td className="btn-group">
                        <Link to={`/events/${e.id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(e.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
