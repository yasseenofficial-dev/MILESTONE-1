import { useState } from 'react';
import { Link } from 'react-router-dom';
import guestClient from '../../api/guestClient.js';

function GuestRSVPPage() {
  const [attendance, setAttendance] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault(); setMessage('');
    guestClient.post('/rsvp', { attendance, dietaryPreference, specialRequirements })
      .then(res => { setMessage(res.data.message); setIsError(false); })
      .catch(err => { setMessage(err.response?.data?.message || 'Failed to submit RSVP.'); setIsError(true); });
  }

  return (
    <div className="guest-page">
      <div className="guest-page-header">
        <Link className="guest-back-link" to="/guest">← Back to Guest Portal</Link>
        <h1 className="guest-page-title">RSVP</h1>
        <p className="guest-page-subtitle">Confirm your attendance and share any preferences.</p>
      </div>
      <div className="guest-content-card">
        <form className="guest-form-grid" onSubmit={handleSubmit}>
          <div className="guest-form-group">
            <label>Attendance Status</label>
            <select value={attendance} onChange={e => setAttendance(e.target.value)} required>
              <option value="">Select an option</option>
              <option value="Attending">Attending</option>
              <option value="Not Attending">Not Attending</option>
              <option value="Maybe">Maybe</option>
            </select>
          </div>
          <div className="guest-form-group">
            <label>Dietary Preferences</label>
            <input type="text" value={dietaryPreference} onChange={e => setDietaryPreference(e.target.value)} placeholder="Vegetarian, no nuts, halal" />
          </div>
          <div className="guest-form-group">
            <label>Special Requirements</label>
            <textarea value={specialRequirements} onChange={e => setSpecialRequirements(e.target.value)} placeholder="Wheelchair access, seating request" />
          </div>
          <button className="guest-primary-button" type="submit">Submit RSVP</button>
        </form>
        {message && <div className={isError ? 'guest-error-box' : 'guest-message-box'}>{message}</div>}
      </div>
    </div>
  );
}

export default GuestRSVPPage;
