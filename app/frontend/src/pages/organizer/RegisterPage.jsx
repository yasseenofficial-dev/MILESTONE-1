import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrganizerAuth } from '../../context/OrganizerAuthContext.jsx';

export default function OrganizerRegisterPage() {
  const { register } = useOrganizerAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', companyName: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await register(form); navigate('/organizer/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create an Account</h1>
        <p className="subtitle">Event Organizer Platform</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group"><label>First Name</label><input className="form-control" name="firstName" value={form.firstName} onChange={handleChange} required /></div>
            <div className="form-group"><label>Last Name</label><input className="form-control" name="lastName" value={form.lastName} onChange={handleChange} required /></div>
          </div>
          <div className="form-group"><label>Email</label><input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required /></div>
          <div className="form-group"><label>Password</label><input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} required /></div>
          <div className="form-group"><label>Company Name</label><input className="form-control" name="companyName" value={form.companyName} onChange={handleChange} /></div>
          <div className="form-group"><label>Phone</label><input className="form-control" name="phone" value={form.phone} onChange={handleChange} /></div>
          <button className="btn btn-primary" type="submit" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/organizer/login">Sign in</Link></p>
        <p className="auth-footer"><Link to="/">← Back to Home</Link></p>
      </div>
    </div>
  );
}
