import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVenueOwnerAuth } from '../../context/VenueOwnerAuthContext.jsx';

export default function VenueOwnerLoginPage() {
  const { login } = useVenueOwnerAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('nadine.farouk@venues.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(email, password); navigate('/venue-owner/listings'); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>PopEyez</h1>
        <p className="subtitle">Venue Owner Login</p>
        {error && <div className="alert error">{error}</div>}
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Log in'}</button>
        <p className="auth-switch">New venue owner? <Link to="/venue-owner/register">Register here</Link></p>
        <p className="hint">Demo: nadine.farouk@venues.com / password</p>
        <p className="auth-switch" style={{ marginTop: '8px' }}><Link to="/">← Home</Link></p>
      </form>
    </div>
  );
}
