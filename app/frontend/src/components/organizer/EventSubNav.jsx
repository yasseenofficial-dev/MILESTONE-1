import { NavLink, useParams } from 'react-router-dom';

const tabs = (eventId) => [
  { to: `/events/${eventId}`, label: 'Overview', end: true },
  { to: `/events/${eventId}/stakeholders`, label: 'Stakeholders' },
  { to: `/events/${eventId}/tasks`, label: 'Tasks' },
  { to: `/events/${eventId}/budget`, label: 'Budget' },
  { to: `/events/${eventId}/floor-plans`, label: 'Floor Plans' },
  { to: `/events/${eventId}/staff`, label: 'Staff' },
  { to: `/events/${eventId}/vendors`, label: 'Vendors' },
  { to: `/events/${eventId}/guests`, label: 'Guests' },
];

export default function EventSubNav({ eventTitle }) {
  const { eventId } = useParams();
  return (
    <div>
      {eventTitle && <h2 style={{ marginBottom: '0.5rem' }}>{eventTitle}</h2>}
      <nav className="event-subnav">
        {tabs(eventId).map((tab) => (
          <NavLink key={tab.to} to={tab.to} end={tab.end}>{tab.label}</NavLink>
        ))}
      </nav>
    </div>
  );
}
