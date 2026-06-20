import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const organizerLinks = [
    ['/organizer/dashboard', 'Day-Of Dashboard'],
    ['/organizer/communications', 'Guest Communications'],
    ['/organizer/reports', 'Reports']
  ];
  const staffLinks = [
    ['/staff/events', 'My Events'],
    ['/staff/tasks', 'My Tasks'],
    ['/staff/floor-plan', 'Floor Plan'],
    ['/staff/check-in', 'Guest Check-In'],
    ['/staff/vendors', 'Vendor Arrivals']
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
