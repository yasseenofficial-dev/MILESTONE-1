import { useEffect, useState } from 'react';
import api from '../api/client.js';
import EventSelector from '../components/EventSelector.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function VendorArrivalPage() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState('');
  const [vendors, setVendors] = useState([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    api.get('/events').then(res => {
      setEvents(res.data.events);
      setEventId(res.data.events[0]?.id || '');
    });
  }, []);

  async function load() {
    if (!eventId) return;
    const res = await api.get(`/vendors/event/${eventId}`);
    setVendors(res.data.eventVendors);
  }

  useEffect(() => { load(); }, [eventId]);

  async function markArrival(record, arrivalStatus) {
    await api.patch(`/vendors/event-vendors/${record.id}/arrival`, {
      arrivalStatus,
      deliveryStatus: arrivalStatus === 'arrived' ? 'Delivered' : record.deliveryStatus,
      note: arrivalStatus === 'arrived' ? 'Marked arrived by staff at venue.' : 'Marked delayed by staff.'
    });
    setNotice(`${record.vendor.name} marked as ${arrivalStatus}.`);
    await load();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Journey 11"
        title="Vendor Arrival Coordination"
        description="Access vendors associated with each event and mark vendors as arrived upon delivery."
      >
        <EventSelector events={events} value={eventId} onChange={setEventId} />
      </PageHeader>
      {notice && <div className="success-box">{notice}</div>}
      <section className="panel">
        <div className="cards-list">
          {vendors.map(record => (
            <div className="mini-card" key={record.id}>
              <div className="space-between">
                <strong>{record.vendor?.name}</strong>
                <div className="row-gap"><StatusBadge value={record.deliveryStatus} /><StatusBadge value={record.arrivalStatus} /></div>
              </div>
              <p>{record.orderSummary}</p>
              <small>Expected arrival: {record.expectedArrival} • {record.vendor?.mainLocation}</small>
              {record.arrivalNote && <p className="muted">Note: {record.arrivalNote}</p>}
              <div className="row-gap">
                <button className="primary-button" onClick={() => markArrival(record, 'arrived')}>Mark arrived</button>
                <button className="secondary-button" onClick={() => markArrival(record, 'delayed')}>Mark delayed</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
