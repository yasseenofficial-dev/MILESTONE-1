import { useEffect, useState } from 'react';
import api from '../../api/dayofClient.js';
import PageHeader from '../../components/dayof/PageHeader.jsx';
import StatusBadge from '../../components/dayof/StatusBadge.jsx';

export default function StaffEventsPage() {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState('');

  async function load() {
    const res = await api.get('/events', { params: date ? { date } : {} });
    setEvents(res.data.events);
  }

  useEffect(() => { load(); }, [date]);

  return (
    <div>
      <PageHeader eyebrow="Journey 9" title="My Participating Events"
        description="View the events you are assigned to and filter by date.">
        <label className="field inline-field">
          <span>Date filter</span>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>
        {date && <button className="ghost-button" onClick={() => setDate('')}>Clear</button>}
      </PageHeader>
      <section className="panel">
        <div className="cards-list">
          {events.map(event => (
            <div className="mini-card event-card" key={event.id}>
              <div className="space-between"><strong>{event.name}</strong><StatusBadge value={event.status} /></div>
              <p>{event.venueName} — {event.location}</p>
              <span>{event.date} | {event.startTime}–{event.endTime}</span>
            </div>
          ))}
          {events.length === 0 && <p className="muted">No events match this filter.</p>}
        </div>
      </section>
    </div>
  );
}
