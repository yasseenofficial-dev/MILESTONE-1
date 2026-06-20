import { useEffect, useState } from 'react';
import { venueApi } from '../../api/index.js';
import { Loading, StatusBadge } from '../../components/organizer/ui.jsx';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const load = () => {
    setLoading(true);
    const params = statusFilter ? { status: statusFilter } : {};
    venueApi.getBookings(params).then((res) => setBookings(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking application?')) return;
    await venueApi.cancelBooking(id);
    load();
  };

  return (
    <div>
      <div className="page-header"><h1>Booking Applications</h1></div>
      <div className="filters-bar">
        <div className="form-group"><label>Status</label>
          <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            {['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select></div>
      </div>
      {loading ? <Loading /> : (
        <div className="card">
          <table>
            <thead><tr><th>Event</th><th>Venue</th><th>Dates</th><th>Status</th><th>Submitted</th><th>Actions</th></tr></thead>
            <tbody>
              {bookings.length === 0 ? <tr><td colSpan={6} className="empty-state">No bookings found</td></tr>
                : bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.event?.title}</td><td>{b.venue?.name}</td>
                    <td>{new Date(b.startDate).toLocaleDateString()} — {new Date(b.endDate).toLocaleDateString()}</td>
                    <td><StatusBadge status={b.status} /></td>
                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td>{b.status === 'PENDING' && <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}>Cancel</button>}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
