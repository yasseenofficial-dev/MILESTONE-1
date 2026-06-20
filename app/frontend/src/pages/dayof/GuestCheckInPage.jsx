import { useEffect, useState } from 'react';
import api from '../../api/dayofClient.js';
import EventSelector from '../../components/dayof/EventSelector.jsx';
import PageHeader from '../../components/dayof/PageHeader.jsx';
import StatusBadge from '../../components/dayof/StatusBadge.jsx';

export default function DayofGuestCheckInPage() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState('');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [guests, setGuests] = useState([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    api.get('/events').then(res => { setEvents(res.data.events); setEventId(res.data.events[0]?.id || ''); });
  }, []);

  async function load() {
    if (!eventId) return;
    const res = await api.get('/guests', { params: { eventId, status, search } });
    setGuests(res.data.guests);
  }
  useEffect(() => { load(); }, [eventId, status]);

  async function updateGuest(guest, checkInStatus) {
    await api.patch(`/guests/${guest.id}/check-in`, { checkInStatus });
    setNotice(`${guest.name} → ${checkInStatus}`); await load();
  }

  return (
    <div>
      <PageHeader eyebrow="Journey 11" title="Guest Check-In"
        description="Filter guests and update check-in status.">
        <EventSelector events={events} value={eventId} onChange={setEventId} />
      </PageHeader>
      <section className="filter-bar">
        <label className="field inline-field">
          <span>Status</span>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="not-arrived">Not arrived</option>
            <option value="checked-in">Checked in</option>
          </select>
        </label>
        <label className="field inline-field grow">
          <span>Search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Name or email" />
        </label>
        <button className="secondary-button" onClick={load}>Search</button>
      </section>
      {notice && <div className="success-box">{notice}</div>}
      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>RSVP</th><th>Dietary</th><th>QR Code</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {guests.map(g => (
                <tr key={g.id}>
                  <td><strong>{g.name}</strong><br /><small>{g.email}</small></td>
                  <td>{g.rsvpStatus}</td><td>{g.dietaryPreference}</td><td>{g.qrCode}</td>
                  <td><StatusBadge value={g.checkInStatus} /></td>
                  <td className="row-gap">
                    <button className="primary-button small" onClick={() => updateGuest(g, 'checked-in')}>Check in</button>
                    <button className="ghost-button small" onClick={() => updateGuest(g, 'not-arrived')}>Undo</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
