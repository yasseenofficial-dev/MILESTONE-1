import { Link } from 'react-router-dom';

const modules = [
  {
    title: 'Event Organizer Platform',
    description: 'Create and manage events, venues, budgets, tasks, staff, vendors and guests.',
    icon: '📅',
    link: '/login',
    linkLabel: 'Enter as Organizer',
    credentials: [
      'organizer@events.com / password',
      'or register a new account',
    ],
  },
  {
    title: 'Guest Portal',
    description: 'View your invitation, RSVP, read event updates, check in, and leave feedback.',
    icon: '🎟️',
    link: '/guest/login',
    linkLabel: 'Enter Guest Portal',
    credentials: [
      'sara.hassan@guest.com / password',
      'karim.ali@guest.com / password',
    ],
  },
  {
    title: 'Client & Vendor Sourcing',
    description: 'Clients track sourcing requests, deliveries and invoices. Vendors accept requests and confirm deliveries.',
    icon: '🚚',
    link: '/client/events',
    linkLabel: 'Client View',
    link2: '/vendor/requests',
    linkLabel2: 'Vendor View',
    credentials: ['Client: no login', 'Vendor login: vendor@example.com / 1234'],
  },
  {
    title: 'Day-Of Operations',
    description: 'Organizer real-time dashboard, staff task tracking, floor plan, guest check-in, vendor arrivals & communications.',
    icon: '⚡',
    link: '/dayof/login',
    linkLabel: 'Enter Day-Of Portal',
    credentials: [
      'organizer@popeyez.com / password123',
      'staff@popeyez.com / password123',
    ],
  },
  {
    title: 'Venue Owner Portal',
    description: 'Manage venue listings, respond to booking requests, view confirmed bookings, and run analytics reports.',
    icon: '🏛️',
    link: '/venue-owner/login',
    linkLabel: 'Enter as Venue Owner',
    credentials: [
      'nadine.farouk@venues.com / password',
      'omar.khalil@venues.com / password',
    ],
  },
];

export default function MainHomePage() {
  return (
    <div className="home-page">
      <header className="home-hero">
        <h1>PopEyez</h1>
        <p>Event Management Platform — Unified Application</p>
        <p style={{ fontSize: '1rem', opacity: 0.7, marginTop: '-24px' }}>
          Five integrated modules: organizer · guest portal · sourcing · day-of operations · venue owner
        </p>
      </header>

      <div className="home-modules">
        {modules.map((mod) => (
          <div key={mod.title} className="home-module-card" style={{ cursor: 'default' }}>
            <span className="home-module-icon">{mod.icon}</span>
            <h2>{mod.title}</h2>
            <p>{mod.description}</p>
            <div className="home-module-creds">
              {mod.credentials.map((c) => <p key={c}>{c}</p>)}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
              <Link to={mod.link} className="home-cta">{mod.linkLabel}</Link>
              {mod.link2 && <Link to={mod.link2} className="home-cta">{mod.linkLabel2}</Link>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
