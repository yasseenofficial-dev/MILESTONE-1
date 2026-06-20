import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const [email, setEmail] = useState('organizer@popeyez.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      navigate(user.role === 'organizer' ? '/organizer/dashboard' : '/staff/events');
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
            <p>User Journeys 6–11</p>
          </div>
        </div>
        <h2>Sign in</h2>
        <p className="muted">Use an organizer or staff demo account to test the scoped milestone workflows.</p>
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
          <strong>Demo accounts</strong>
          <button onClick={() => setEmail('organizer@popeyez.com')}>Organizer</button>
          <button onClick={() => setEmail('staff@popeyez.com')}>Staff</button>
          <button onClick={() => setEmail('staff2@popeyez.com')}>Staff 2</button>
          <span>Password: password123</span>
        </div>
      </div>
    </div>
  );
}
