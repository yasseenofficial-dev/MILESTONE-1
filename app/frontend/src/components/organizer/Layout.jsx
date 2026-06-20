import { NavLink, useNavigate } from 'react-router-dom';
import { useOrganizerAuth } from '../../context/OrganizerAuthContext.jsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/events', label: 'Events', icon: '📅' },
  { to: '/accounts', label: 'Accounts', icon: '👤' },
  { to: '/venues', label: 'Venues', icon: '🏛️' },
  { to: '/bookings', label: 'Bookings', icon: '📋' },
  { to: '/guest', label: 'Guest Portal', icon: '🎟️' },
  { to: '/', label: '⬅ Home', icon: '🏠' },
];

export default function OrganizerLayout({ children }) {
  const { user, logout } = useOrganizerAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">PopEyez Organizer</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? 'active' : ''}>
              <span>{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '1.5rem', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>
            {user?.firstName} {user?.lastName}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem' }}>
            {user?.companyName || user?.email}
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout} style={{ width: '100%' }}>
            Sign Out
          </button>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
