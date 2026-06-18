import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { eventApi } from '../api';
import EventSubNav from '../components/EventSubNav';
import { Loading, StatusBadge } from '../components/ui';

export default function EventDetailPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventApi.getEvent(eventId)
      .then((res) => setEvent(res.data.data))
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) return <Loading />;
  if (!event) return <div>Event not found</div>;

  return (
    <div>
      <EventSubNav eventTitle={event.title} />
      <div className="page-header">
        <div />
        <Link to={`/events/${eventId}/edit`} className="btn btn-secondary">Edit Event</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="label">Status</div><div className="value" style={{ fontSize: '1rem' }}><StatusBadge status={event.status} /></div></div>
        <div className="stat-card"><div className="label">Guests</div><div className="value">{event._count?.guests || 0}</div></div>
        <div className="stat-card"><div className="label">Tasks</div><div className="value">{event._count?.tasks || 0}</div></div>
        <div className="stat-card"><div className="label">Staff</div><div className="value">{event._count?.staff || 0}</div></div>
        <div className="stat-card"><div className="label">Vendors</div><div className="value">{event._count?.eventVendors || 0}</div></div>
      </div>

      <div className="card">
        <div className="card-title">Event Details</div>
        <table>
          <tbody>
            <tr><th>Type</th><td>{event.eventType}</td></tr>
            <tr><th>Start</th><td>{new Date(event.startDate).toLocaleString()}</td></tr>
            <tr><th>End</th><td>{new Date(event.endDate).toLocaleString()}</td></tr>
            <tr><th>Expected Attendees</th><td>{event.expectedAttendees || '—'}</td></tr>
            <tr><th>Venue</th><td>{event.venue?.name || 'Not assigned'}</td></tr>
            <tr><th>Description</th><td>{event.description || '—'}</td></tr>
          </tbody>
        </table>
      </div>

      {event.stakeholders?.length > 0 && (
        <div className="card">
          <div className="card-title">Stakeholders</div>
          <table>
            <thead><tr><th>Name</th><th>Role</th><th>Email</th></tr></thead>
            <tbody>
              {event.stakeholders.map((s) => (
                <tr key={s.id}><td>{s.name}</td><td>{s.role}</td><td>{s.email || '—'}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
