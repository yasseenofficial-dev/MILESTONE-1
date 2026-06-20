import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrganizerAuth } from '../../context/OrganizerAuthContext.jsx';

export default function OrganizerLoginPage() {
  const { login } = useOrganizerAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(email, password); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="subtitle">Event Organizer Platform</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="organizer@events.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', textAlign: 'center', margin: '0.75rem 0 0' }}>
          Demo: <strong>organizer@events.com</strong> / <strong>password</strong>
        </p>
        <Link to="/register" className="btn btn-secondary" style={{ display: 'block', textAlign: 'center', marginTop: '0.75rem' }}>
          Create an Account
        </Link>
        <p className="auth-footer" style={{ marginTop: '1rem' }}>
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
