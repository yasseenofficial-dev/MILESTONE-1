import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, getClientRequests, createRequest } from '../../api/alaaClientApi.js';

function ClientRequestsPage() {
  const [events, setEvents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ eventId: '', items: '', notes: '' });

  const fetchData = () => {
    getEvents().then(res => setEvents(res.data.events));
    getClientRequests().then(res => setRequests(res.data.requests));
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemsArray = form.items.split(',').map(item => ({ name: item.trim(), quantity: 1 }));
    await createRequest({ eventId: parseInt(form.eventId), items: itemsArray, notes: form.notes });
    fetchData();
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <Link to="/" style={{ color: '#d97706', fontWeight: 700 }}>← Home</Link>
        <h2>Client Requests</h2>
      </div>
      <form onSubmit={handleSubmit} className="card">
        <select value={form.eventId} onChange={(e) => setForm({ ...form, eventId: e.target.value })}>
          <option value="">Select Event</option>
          {events.map(ev => <option key={ev.id} value={ev.id}>{ev.eventName}</option>)}
        </select>
        <input type="text" placeholder="Items (comma separated)" value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} />
        <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button type="submit">Send Request</button>
      </form>
      <h3 style={{ marginTop: '30px' }}>Your Requests</h3>
      {requests.length === 0 && <p>No requests found.</p>}
      {requests.map(req => (
        <div key={req.id} className="card">
          <p><strong>Event:</strong> {req.eventName}</p>
          <p><strong>Status:</strong> {req.status}</p>
          <p><strong>Items:</strong> {req.items.map(i => i.name).join(', ')}</p>
          <p><strong>Notes:</strong> {req.notes}</p>
        </div>
      ))}
    </div>
  );
}

export default ClientRequestsPage;
