import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGuestAuth } from '../../context/GuestAuthContext.jsx';

export default function GuestLoginPage() {
  const { guestLogin } = useGuestAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await guestLogin(email, password);
      navigate('/guest');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Guest Portal</h1>
        <p className="subtitle">Sign in to view your invitation &amp; RSVP</p>

        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px',
            padding: '12px 16px', color: '#dc2626', fontWeight: 600,
            marginBottom: '16px', fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="sara.hassan@guest.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', textAlign: 'center', margin: '0.75rem 0 0' }}>
          Demo: <strong>sara.hassan@guest.com</strong> / <strong>password</strong>
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', textAlign: 'center', marginTop: '4px' }}>
          Also: <strong>karim.ali@guest.com</strong> / <strong>password</strong>
        </p>
        <p className="auth-footer" style={{ marginTop: '1rem' }}>
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
