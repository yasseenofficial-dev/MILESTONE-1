import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginVendor } from '../../api/alaaVendorApi.js';

function VendorLoginPage() {
  const [email, setEmail] = useState('vendor@example.com');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault(); setError('');
    try {
      const res = await loginVendor(email, password);
      if (res.data.success) { localStorage.setItem('vendorId', res.data.vendorId); navigate('/vendor/requests'); }
      else { setError('Login failed'); }
    } catch { setError('Invalid credentials'); }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '400px', margin: '100px auto', background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#d97706' }}>Vendor Login</h1>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>AlaaMilstone2 — Vendor Portal</p>
        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
          <button type="submit" style={{ padding: '12px', background: '#d97706', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Login</button>
        </form>
        <p style={{ marginTop: '16px', fontSize: '13px', color: '#6b7280' }}>Demo: vendor@example.com / 1234</p>
        <p style={{ marginTop: '8px' }}><Link to="/">← Back to Home</Link></p>
      </div>
    </div>
  );
}

export default VendorLoginPage;
