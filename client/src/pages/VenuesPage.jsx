import { useEffect, useState } from 'react';
import { venueApi, eventApi } from '../api';
import { Loading, Modal, Alert } from '../components/ui';

export default function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: '', minCapacity: '', maxPrice: '', search: '' });
  const [bookingModal, setBookingModal] = useState(null);
  const [bookingForm, setBookingForm] = useState({ eventId: '', startDate: '', endDate: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = () => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    Promise.all([venueApi.getVenues(params), eventApi.getEvents()])
      .then(([vRes, eRes]) => {
        setVenues(vRes.data.data);
        setEvents(eRes.data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openBooking = (venue) => {
    setBookingModal(venue);
    setBookingForm({ eventId: '', startDate: '', endDate: '', message: '' });
    setError('');
    setSuccess('');
  };

  const submitBooking = async () => {
    try {
      await venueApi.createBooking({ ...bookingForm, venueId: bookingModal.id });
      setSuccess('Booking application submitted!');
      setTimeout(() => setBookingModal(null), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div>
      <div className="page-header"><h1>Venue Search</h1></div>

      <form className="filters-bar card" onSubmit={(e) => { e.preventDefault(); load(); }}>
        <div className="form-group">
          <label>Search</label>
          <input className="form-control" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="Name or address..." />
        </div>
        <div className="form-group">
          <label>City</label>
          <input className="form-control" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Min Capacity</label>
          <input className="form-control" type="number" value={filters.minCapacity} onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Max Price/Day</label>
          <input className="form-control" type="number" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-secondary">Search</button>
      </form>

      {loading ? <Loading /> : (
        <div className="venue-grid">
          {venues.map((v) => (
            <div key={v.id} className="venue-card">
              <div className="venue-card-body">
                <h3>{v.name}</h3>
                <div className="meta">{v.address}, {v.city} · Capacity: {v.capacity}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>
                  {v.description?.slice(0, 120)}...
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.75rem' }}>
                  {(v.amenities || []).map((a) => (
                    <span key={a} className="badge badge-gray">{a}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="price">EGP {v.pricePerDay.toLocaleString()}/day</span>
                  <span>★ {v.rating}</span>
                </div>
                <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem', width: '100%' }}
                  onClick={() => openBooking(v)}>
                  Apply to Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {bookingModal && (
        <Modal title={`Book: ${bookingModal.name}`} onClose={() => setBookingModal(null)} onSubmit={submitBooking} submitLabel="Submit Application">
          <Alert message={error} />
          <Alert type="success" message={success} />
          <div className="form-group">
            <label>Event</label>
            <select className="form-control" value={bookingForm.eventId}
              onChange={(e) => setBookingForm({ ...bookingForm, eventId: e.target.value })} required>
              <option value="">Select event</option>
              {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input className="form-control" type="date" value={bookingForm.startDate}
                onChange={(e) => setBookingForm({ ...bookingForm, startDate: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input className="form-control" type="date" value={bookingForm.endDate}
                onChange={(e) => setBookingForm({ ...bookingForm, endDate: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea className="form-control" value={bookingForm.message}
              onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })} />
          </div>
        </Modal>
      )}
    </div>
  );
}
