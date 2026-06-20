import { useEffect, useState } from 'react';
import api from '../../api/dayofClient.js';
import EventSelector from '../../components/dayof/EventSelector.jsx';
import PageHeader from '../../components/dayof/PageHeader.jsx';

export default function FloorPlanPage() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState('');
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    api.get('/events').then(res => { setEvents(res.data.events); setEventId(res.data.events[0]?.id || ''); });
  }, []);
  useEffect(() => {
    if (!eventId) return;
    api.get(`/layouts/${eventId}`).then(res => setLayout(res.data.layout));
  }, [eventId]);

  return (
    <div>
      <PageHeader eyebrow="Journey 10" title="Shared Venue Floor Plan"
        description="View the digital floor plan shared by the organizer.">
        <EventSelector events={events} value={eventId} onChange={setEventId} />
      </PageHeader>
      <section className="panel">
        {layout ? (
          <>
            <div className="space-between floor-title">
              <h3>{layout.name}</h3>
              <span>Updated: {new Date(layout.updatedAt).toLocaleString()}</span>
            </div>
            <div className="floor-plan" style={{ aspectRatio: `${layout.width}/${layout.height}` }}>
              {layout.elements.map(el => (
                <div key={el.id}
                  className={`floor-element floor-${el.type.toLowerCase().replace(/\s+/g, '-')}`}
                  style={{ left: `${el.x/layout.width*100}%`, top: `${el.y/layout.height*100}%`, width: `${el.w/layout.width*100}%`, height: `${el.h/layout.height*100}%` }}>
                  <strong>{el.label}</strong><span>{el.type}</span>
                </div>
              ))}
            </div>
          </>
        ) : <p className="muted">No floor plan available for this event.</p>}
      </section>
    </div>
  );
}
