import { NavLink, Outlet } from 'react-router-dom';
import { useDayofAuth } from '../../context/DayofAuthContext.jsx';

export default function DayofAppLayout() {
  const { user, logout } = useDayofAuth();
  const organizerLinks = [
    ['/dayof/organizer/dashboard', 'Day-Of Dashboard'],
    ['/dayof/organizer/communications', 'Guest Communications'],
    ['/dayof/organizer/reports', 'Reports']
  ];
  const staffLinks = [
    ['/dayof/staff/events', 'My Events'],
    ['/dayof/staff/tasks', 'My Tasks'],
    ['/dayof/staff/floor-plan', 'Floor Plan'],
    ['/dayof/staff/check-in', 'Guest Check-In'],
    ['/dayof/staff/vendors', 'Vendor Arrivals']
  ];
  const links = user?.role === 'organizer' ? organizerLinks : staffLinks;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">PE</div>
          <div>
            <h1>PopEyez</h1>
            <p>Journeys 6–11</p>
          </div>
        </div>
        <nav>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active nav-link' : 'nav-link'}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <strong>{user?.name}</strong>
          <span>{user?.role}</span>
          <button className="ghost-button" onClick={logout}>Log out</button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
