import { useState } from 'react';
import { Link } from 'react-router-dom';
import guestClient from '../../api/guestClient.js';

const RATINGS = ['', 'Excellent', 'Good', 'Average', 'Poor'];

function GuestFeedbackPage() {
  const [form, setForm] = useState({ overallExperience: '', foodRating: '', venueRating: '', organizationRating: '', comments: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  function handleSubmit(e) {
    e.preventDefault(); setMessage('');
    guestClient.post('/feedback', form)
      .then(res => { setMessage(res.data.message); setIsError(false); })
      .catch(err => { setMessage(err.response?.data?.message || 'Failed to submit.'); setIsError(true); });
  }

  const ratingField = (label, field) => (
    <div className="guest-form-group" key={field}>
      <label>{label}</label>
      <select value={form[field]} onChange={set(field)} required>
        {RATINGS.map(r => <option key={r} value={r}>{r || 'Select rating'}</option>)}
      </select>
    </div>
  );

  return (
    <div className="guest-page">
      <div className="guest-page-header">
        <Link className="guest-back-link" to="/guest">← Back to Guest Portal</Link>
        <h1 className="guest-page-title">Post-Event Feedback</h1>
        <p className="guest-page-subtitle">Help us improve future events.</p>
      </div>
      <div className="guest-content-card">
        <form className="guest-form-grid" onSubmit={handleSubmit}>
          {ratingField('Overall Experience', 'overallExperience')}
          {ratingField('Food and Beverages', 'foodRating')}
          {ratingField('Venue', 'venueRating')}
          {ratingField('Organization', 'organizationRating')}
          <div className="guest-form-group">
            <label>Open Comments</label>
            <textarea value={form.comments} onChange={set('comments')} placeholder="Write your comments here..." />
          </div>
          <button className="guest-primary-button" type="submit">Submit Feedback</button>
        </form>
        {message && <div className={isError ? 'guest-error-box' : 'guest-message-box'}>{message}</div>}
      </div>
    </div>
  );
}

export default GuestFeedbackPage;
