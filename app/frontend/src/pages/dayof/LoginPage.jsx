import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDayofAuth } from '../../context/DayofAuthContext.jsx';

export default function DayofLoginPage() {
  const [email, setEmail] = useState('organizer@popeyez.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const { login, loading } = useDayofAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      navigate(user.role === 'organizer' ? '/dayof/organizer' : '/dayof/staff/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand large">
          <div className="brand-mark">PE</div>
          <div>
            <h1>PopEyez</h1>
            <p>Day-Of Operations (Journeys 6–11)</p>
          </div>
        </div>
        <h2>Sign in</h2>
        <p className="muted">Use an organizer or staff demo account.</p>
        <form onSubmit={handleSubmit} className="form-stack">
          <label className="field">
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error && <div className="error-box">{error}</div>}
          <button className="primary-button" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </form>
        <div className="demo-box">
          <strong>Demo accounts (password: password123)</strong>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
            <button onClick={() => { setEmail('organizer@popeyez.com'); setPassword('password123'); }}>Organizer</button>
            <button onClick={() => { setEmail('staff@popeyez.com'); setPassword('password123'); }}>Staff</button>
            <button onClick={() => { setEmail('staff2@popeyez.com'); setPassword('password123'); }}>Staff 2</button>
          </div>
        </div>
        <p style={{ marginTop: '16px', fontSize: '14px', textAlign: 'center' }}>
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
