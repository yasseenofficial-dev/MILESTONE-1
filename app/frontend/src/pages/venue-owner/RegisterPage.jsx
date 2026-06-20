import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVenueOwnerAuth } from '../../context/VenueOwnerAuthContext.jsx';

export default function VenueOwnerRegisterPage() {
  const { register } = useVenueOwnerAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ownerName: '', companyName: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); setError(''); setLoading(true);
    try { await register(form); navigate('/venue-owner/listings'); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>PopEyez</h1>
        <p className="subtitle">Create Venue Owner Account</p>
        {error && <div className="alert error">{error}</div>}
        {['ownerName', 'companyName', 'email', 'phone'].map(field => (
          <React.Fragment key={field}>
            <label>{field.replace(/([A-Z])/g, ' $1').trim()}</label>
            <input type={field === 'email' ? 'email' : 'text'} value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              required={['ownerName', 'email'].includes(field)} />
          </React.Fragment>
        ))}
        <label>Password</label>
        <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
        <p className="auth-switch">Already have an account? <Link to="/venue-owner/login">Log in</Link></p>
      </form>
    </div>
  );
}
