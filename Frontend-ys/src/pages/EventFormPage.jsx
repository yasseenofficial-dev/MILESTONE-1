import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventApi, venueApi } from '../api';
import { Alert, Loading } from '../components/ui';

const emptyForm = {
  title: '', description: '', eventType: 'CONFERENCE', status: 'DRAFT',
  startDate: '', endDate: '', expectedAttendees: '', venueId: '',
};

export default function EventFormPage() {
  const { eventId } = useParams();
  const isEdit = Boolean(eventId);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    venueApi.getVenues().then((res) => setVenues(res.data.data));
    if (isEdit) {
      eventApi.getEvent(eventId).then((res) => {
        const e = res.data.data;
        setForm({
          title: e.title,
          description: e.description || '',
          eventType: e.eventType,
          status: e.status,
          startDate: e.startDate.slice(0, 16),
          endDate: e.endDate.slice(0, 16),
          expectedAttendees: e.expectedAttendees || '',
          venueId: e.venueId || '',
        });
      }).finally(() => setLoading(false));
    }
  }, [eventId, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        expectedAttendees: form.expectedAttendees ? parseInt(form.expectedAttendees, 10) : null,
        venueId: form.venueId || null,
      };
      if (isEdit) {
        await eventApi.updateEvent(eventId, payload);
        navigate(`/events/${eventId}`);
      } else {
        const res = await eventApi.createEvent(payload);
        navigate(`/events/${res.data.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event');
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header">
        <h1>{isEdit ? 'Edit Event' : 'Create Event'}</h1>
      </div>
      <div className="card" style={{ maxWidth: 640 }}>
        <Alert message={error} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input className="form-control" name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-control" name="description" value={form.description} onChange={handleChange} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Event Type</label>
              <select className="form-control" name="eventType" value={form.eventType} onChange={handleChange}>
                {['CONFERENCE', 'GALA', 'PRODUCT_LAUNCH', 'WORKSHOP', 'WEDDING'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" name="status" value={form.status} onChange={handleChange}>
                {['DRAFT', 'PLANNING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input className="form-control" type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input className="form-control" type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Expected Attendees</label>
              <input className="form-control" type="number" name="expectedAttendees" value={form.expectedAttendees} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Venue</label>
              <select className="form-control" name="venueId" value={form.venueId} onChange={handleChange}>
                <option value="">No venue selected</option>
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>{v.name} — {v.city}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="btn-group">
            <button type="submit" className="btn btn-primary">{isEdit ? 'Save Changes' : 'Create Event'}</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
