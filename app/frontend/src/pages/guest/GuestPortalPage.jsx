import { Link, useNavigate } from 'react-router-dom';
import { useGuestAuth } from '../../context/GuestAuthContext.jsx';

function GuestPortalPage() {
  const { guestUser, guestLogout } = useGuestAuth();
  const navigate = useNavigate();
  const handleLogout = () => { guestLogout(); navigate('/guest/login'); };

  return (
    <div className="guest-page">
      <section className="guest-hero">
        <p className="guest-eyebrow">Guest Portal — Welcome, {guestUser?.name || guestUser?.email}</p>
        <h1>Tech Networking Night</h1>
        <p className="guest-hero-text">
          View your invitation, RSVP, receive event updates, check in, and submit post-event feedback.
        </p>
      </section>
      <section className="guest-card-grid">
        <Link className="guest-feature-card" to="/guest/invitation">
          <span className="guest-card-icon">✉️</span><h2>Invitation</h2>
          <p>View event details, venue, dress code, and agenda.</p>
        </Link>
        <Link className="guest-feature-card" to="/guest/rsvp">
          <span className="guest-card-icon">✅</span><h2>RSVP</h2>
          <p>Confirm attendance and submit preferences.</p>
        </Link>
        <Link className="guest-feature-card" to="/guest/messages">
          <span className="guest-card-icon">📢</span><h2>Messages</h2>
          <p>Receive day-of updates from the organizer.</p>
        </Link>
        <Link className="guest-feature-card" to="/guest/check-in">
          <span className="guest-card-icon">🎟️</span><h2>Check-In</h2>
          <p>Show your guest information and confirm check-in.</p>
        </Link>
        <Link className="guest-feature-card" to="/guest/feedback">
          <span className="guest-card-icon">⭐</span><h2>Feedback</h2>
          <p>Submit your post-event experience review.</p>
        </Link>
      </section>
      <p style={{ marginTop: '24px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <Link to="/" style={{ color: '#2563eb', fontWeight: 700 }}>← Back to Home</Link>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#dc2626', fontWeight: 700, cursor: 'pointer' }}>Sign Out</button>
      </p>
    </div>
  );
}

export default GuestPortalPage;
