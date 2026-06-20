import { useEffect, useState } from 'react';
import api from '../api/client.js';
import EventSelector from '../components/EventSelector.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function FloorPlanPage() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState('');
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    api.get('/events').then(res => {
      setEvents(res.data.events);
      setEventId(res.data.events[0]?.id || '');
    });
  }, []);

  useEffect(() => {
    if (!eventId) return;
    api.get(`/layouts/${eventId}`).then(res => setLayout(res.data.layout));
  }, [eventId]);

  return (
    <div>
      <PageHeader
        eyebrow="Journey 10"
        title="Shared Venue Floor Plan"
        description="Staff can view the digital floor plan shared by the organizer."
      >
        <EventSelector events={events} value={eventId} onChange={setEventId} />
      </PageHeader>
      <section className="panel">
        {layout && (
          <>
            <div className="space-between floor-title">
              <h3>{layout.name}</h3>
              <span>Last updated: {new Date(layout.updatedAt).toLocaleString()}</span>
            </div>
            <div className="floor-plan" style={{ aspectRatio: `${layout.width}/${layout.height}` }}>
              {layout.elements.map(element => (
                <div
                  key={element.id}
                  className={`floor-element floor-${element.type.toLowerCase().replace(/\s+/g, '-')}`}
                  style={{ left: `${element.x / layout.width * 100}%`, top: `${element.y / layout.height * 100}%`, width: `${element.w / layout.width * 100}%`, height: `${element.h / layout.height * 100}%` }}
                >
                  <strong>{element.label}</strong>
                  <span>{element.type}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
