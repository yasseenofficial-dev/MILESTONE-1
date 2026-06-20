import { useState } from 'react';
import { Link } from 'react-router-dom';
import guestClient from '../../api/guestClient.js';

function GuestCheckInPage() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  function handleCheckIn() {
    guestClient.post('/check-in', { guestName: 'Sara Hassan', qrCode: 'GUEST-2026-SARA' })
      .then(res => { setMessage(res.data.message); setCheckedIn(true); setIsError(false); })
      .catch(err => { setMessage(err.response?.data?.message || 'Check-in failed.'); setIsError(true); });
  }

  return (
    <div className="guest-page">
      <div className="guest-page-header">
        <Link className="guest-back-link" to="/guest">← Back to Guest Portal</Link>
        <h1 className="guest-page-title">Event Check-In</h1>
        <p className="guest-page-subtitle">Present your guest information at the entrance.</p>
      </div>
      <div className="guest-content-card">
        <div className="guest-detail-list">
          <div className="guest-detail-item"><span className="guest-detail-label">Guest Name</span><span className="guest-detail-value">Sara Hassan</span></div>
          <div className="guest-detail-item"><span className="guest-detail-label">Event</span><span className="guest-detail-value">Tech Networking Night</span></div>
        </div>
        <div className="guest-qr-box"><p>Guest QR Code</p><div className="guest-qr-code">GUEST-2026-SARA</div></div>
        <button className="guest-primary-button" onClick={handleCheckIn} disabled={checkedIn}>
          {checkedIn ? 'Checked In ✓' : 'Confirm Check-In'}
        </button>
        {message && <div className={isError ? 'guest-error-box' : 'guest-message-box'}>{message}</div>}
      </div>
    </div>
  );
}

export default GuestCheckInPage;
