import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { guestApi } from '../../api/index.js';
import EventSubNav from '../../components/organizer/EventSubNav.jsx';
import { Loading, Modal, StatusBadge } from '../../components/organizer/ui.jsx';

const DIETARY_OPTIONS = ['None', 'Vegetarian', 'Vegan', 'Halal', 'Gluten-Free', 'Nut Allergy', 'Kosher'];

export default function GuestsPage() {
  const { eventId } = useParams();
  const [guests, setGuests] = useState([]);
  const [stats, setStats] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rsvpFilter, setRsvpFilter] = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', dietaryPreference: 'None', rsvpStatus: 'PENDING', plusOne: false });

  const load = () => {
    setLoading(true);
    const params = {};
    if (rsvpFilter) params.rsvpStatus = rsvpFilter;
    if (search) params.search = search;
    Promise.all([guestApi.getGuests(eventId, params), guestApi.getStats(eventId), guestApi.getFeedback(eventId)])
      .then(([gRes, sRes, fRes]) => { setGuests(gRes.data.data); setStats(sRes.data.data); setFeedback(fRes.data.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [eventId, rsvpFilter]);

  const save = async () => {
    if (modal === 'add') await guestApi.create(eventId, form);
    else await guestApi.update(eventId, modal, form);
    setModal(null); load();
  };

  const sendInvitations = async () => {
    const pending = guests.filter((g) => !g.invitationSentAt).map((g) => g.id);
    if (pending.length === 0) return alert('All guests already invited');
    await guestApi.sendInvitations(eventId, pending);
    load();
  };

  return (
    <div>
      <EventSubNav />
      <div className="page-header">
        <h1>Guest Management</h1>
        <div className="btn-group">
          <button className="btn btn-secondary" onClick={sendInvitations}>Send Invitations</button>
          <button className="btn btn-primary" onClick={() => { setForm({ name: '', email: '', phone: '', dietaryPreference: 'None', rsvpStatus: 'PENDING', plusOne: false }); setModal('add'); }}>+ Add Guest</button>
        </div>
      </div>
      {stats && (
        <div className="stats-grid">
          <div className="stat-card"><div className="label">Total Guests</div><div className="value">{stats.total}</div></div>
          <div className="stat-card"><div className="label">Accepted</div><div className="value" style={{ color: 'var(--success)' }}>{stats.accepted}</div></div>
          <div className="stat-card"><div className="label">Pending</div><div className="value">{stats.pending}</div></div>
          <div className="stat-card"><div className="label">Invitations Sent</div><div className="value">{stats.invitationsSent}</div></div>
          <div className="stat-card"><div className="label">Avg Feedback</div><div className="value">{feedback?.avgRating || 0} ★</div></div>
        </div>
      )}
      <div className="filters-bar">
        <div className="form-group"><label>RSVP Status</label>
          <select className="form-control" value={rsvpFilter} onChange={(e) => setRsvpFilter(e.target.value)}>
            <option value="">All</option>{['PENDING', 'ACCEPTED', 'DECLINED', 'MAYBE'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select></div>
        <div className="form-group"><label>Search</label>
          <input className="form-control" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Guest name..." /></div>
        <button className="btn btn-secondary" onClick={load}>Search</button>
      </div>
      {loading ? <Loading /> : (
        <div className="card">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>RSVP</th><th>Dietary</th><th>Plus One</th><th>Invited</th><th>Actions</th></tr></thead>
            <tbody>
              {guests.map((g) => (
                <tr key={g.id}>
                  <td>{g.name}</td><td>{g.email || '—'}</td><td><StatusBadge status={g.rsvpStatus} /></td>
                  <td>{g.dietaryPreference || 'None'}</td><td>{g.plusOne ? 'Yes' : 'No'}</td><td>{g.invitationSentAt ? '✓' : '—'}</td>
                  <td className="btn-group">
                    <button className="btn btn-secondary btn-sm" onClick={() => { setForm(g); setModal(g.id); }}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={async () => { if (confirm('Remove?')) { await guestApi.remove(eventId, g.id); load(); } }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {stats?.dietary && Object.keys(stats.dietary).length > 0 && (
        <div className="card">
          <div className="card-title">Dietary Breakdown</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.entries(stats.dietary).map(([diet, count]) => <span key={diet} className="badge badge-gray">{diet}: {count}</span>)}
          </div>
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'Add Guest' : 'Edit Guest'} onClose={() => setModal(null)} onSubmit={save}>
          <div className="form-group"><label>Name</label><input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="form-group"><label>Email</label><input className="form-control" type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="form-group"><label>Phone</label><input className="form-control" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="form-row">
            <div className="form-group"><label>RSVP Status</label>
              <select className="form-control" value={form.rsvpStatus} onChange={(e) => setForm({ ...form, rsvpStatus: e.target.value })}>
                {['PENDING', 'ACCEPTED', 'DECLINED', 'MAYBE'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select></div>
            <div className="form-group"><label>Dietary Preference</label>
              <select className="form-control" value={form.dietaryPreference || 'None'} onChange={(e) => setForm({ ...form, dietaryPreference: e.target.value })}>
                {DIETARY_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select></div>
          </div>
          <div className="form-group"><label><input type="checkbox" checked={form.plusOne} onChange={(e) => setForm({ ...form, plusOne: e.target.checked })} /> Plus One</label></div>
        </Modal>
      )}
    </div>
  );
}
