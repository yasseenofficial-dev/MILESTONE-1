import { useEffect, useState } from 'react';
import api from '../api/client.js';
import EventSelector from '../components/EventSelector.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { dateTime } from '../utils/format.js';

export default function CommunicationsPage() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState('');
  const [communications, setCommunications] = useState([]);
  const [form, setForm] = useState({ title: '', message: '', audience: 'all-guests' });
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/events').then(res => {
      setEvents(res.data.events);
      setEventId(res.data.events[0]?.id || '');
    });
  }, []);

  useEffect(() => { if (eventId) load(); }, [eventId]);

  async function load() {
    const res = await api.get('/communications', { params: { eventId } });
    setCommunications(res.data.communications);
  }

  async function sendMessage(e) {
    e.preventDefault();
    setError('');
    setNotice('');
    try {
      await api.post('/communications', { eventId, ...form });
      setForm({ title: '', message: '', audience: 'all-guests' });
      setNotice('Communication sent successfully.');
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send communication');
    }
  }

  async function followUp(communication) {
    setError('');
    setNotice('');
    const title = `Follow-up: ${communication.title}`;
    const message = `Reminder: ${communication.message}`;
    try {
      const res = await api.post(`/communications/${communication.id}/follow-up`, { title, message });
      setNotice(`Follow-up sent to ${res.data.recipients} unseen guests.`);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send follow-up');
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Journey 6"
        title="Day-Of Guest Communications"
        description="Send live updates, track received/seen statuses, and follow up with unseen guests."
      >
        <EventSelector events={events} value={eventId} onChange={setEventId} />
      </PageHeader>

      <div className="two-column">
        <section className="panel">
          <h3>Send live message</h3>
          <form onSubmit={sendMessage} className="form-stack">
            <label className="field">
              <span>Audience</span>
              <select value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })}>
                <option value="all-guests">All guests</option>
                <option value="attending">Attending guests</option>
                <option value="not-arrived">Guests not arrived yet</option>
              </select>
            </label>
            <label className="field">
              <span>Title</span>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Example: Parking update" />
            </label>
            <label className="field">
              <span>Message</span>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Write the day-of update..." />
            </label>
            {notice && <div className="success-box">{notice}</div>}
            {error && <div className="error-box">{error}</div>}
            <button className="primary-button">Send communication</button>
          </form>
        </section>

        <section className="panel">
          <h3>Message status history</h3>
          <div className="cards-list">
            {communications.map(comm => (
              <div className="mini-card" key={comm.id}>
                <div className="space-between">
                  <strong>{comm.title}</strong>
                  <StatusBadge value={comm.type} />
                </div>
                <p>{comm.message}</p>
                <small>Sent {dateTime(comm.sentAt)}</small>
                <div className="stats-row">
                  <span>Recipients: {comm.summary.totalRecipients}</span>
                  <span>Received: {comm.summary.received}</span>
                  <span>Seen: {comm.summary.seen}</span>
                  <span>Unseen: {comm.summary.unseen}</span>
                </div>
                {comm.summary.unseen > 0 && <button className="secondary-button" onClick={() => followUp(comm)}>Send follow-up to unseen</button>}
                <details>
                  <summary>View guest statuses</summary>
                  <div className="status-grid">
                    {comm.statuses.map(status => (
                      <span key={status.id}>{status.guest?.name}: {status.seen ? 'Seen' : 'Not seen'}</span>
                    ))}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
