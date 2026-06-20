import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function GuestInvitationPage() {
  const [invitation, setInvitation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('/api/invitation')
      .then((res) => setInvitation(res.data))
      .catch(() => setError('Failed to load invitation details.'));
  }, []);

  return (
    <div className="guest-page">
      <div className="guest-page-header">
        <Link className="guest-back-link" to="/guest">← Back to Guest Portal</Link>
        <h1 className="guest-page-title">Event Invitation</h1>
        <p className="guest-page-subtitle">Review your official invitation details.</p>
      </div>

      {error && <div className="guest-error-box">{error}</div>}
      {!invitation && !error && <div className="guest-content-card">Loading invitation...</div>}

      {invitation && (
        <div className="guest-content-card">
          <h2>{invitation.eventName}</h2>
          <div className="guest-detail-list">
            {[
              ['Date', invitation.date],
              ['Time', invitation.time],
              ['Venue', invitation.venue],
              ['Dress Code', invitation.dressCode],
              ['Agenda', invitation.agenda],
            ].map(([label, value]) => (
              <div className="guest-detail-item" key={label}>
                <span className="guest-detail-label">{label}</span>
                <span className="guest-detail-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GuestInvitationPage;
