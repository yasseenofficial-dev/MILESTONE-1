import { useEffect, useState } from 'react';
import { accountApi, authApi, eventApi } from '../../api/index.js';
import { useOrganizerAuth } from '../../context/OrganizerAuthContext.jsx';
import { Alert, Loading, Modal, StatusBadge } from '../../components/organizer/ui.jsx';

const ROLE_TABS = [
  { key: 'profile', label: 'My Profile' },
  { key: 'TEAM_MEMBER', label: 'Team Members' },
  { key: 'GUEST', label: 'Guests' },
  { key: 'VENDOR', label: 'Vendors' },
  { key: 'STAKEHOLDER', label: 'Stakeholders' },
];

const emptyAccountForm = { email: '', password: '', firstName: '', lastName: '', phone: '', companyName: '', eventId: '' };

export default function AccountsPage() {
  const { user } = useOrganizerAuth();
  const [tab, setTab] = useState('profile');
  const [accounts, setAccounts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modal, setModal] = useState(null);
  const [accountForm, setAccountForm] = useState(emptyAccountForm);
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', companyName: '', phone: '', currentPassword: '', newPassword: '' });

  const loadAccounts = async (role) => {
    setLoading(true);
    try { const res = await accountApi.getAccounts(role ? { role } : {}); setAccounts(res.data.data); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    eventApi.getEvents().then((res) => setEvents(res.data.data));
    if (user) setProfileForm({ firstName: user.firstName || '', lastName: user.lastName || '', companyName: user.companyName || '', phone: user.phone || '', currentPassword: '', newPassword: '' });
  }, [user]);

  useEffect(() => {
    if (tab === 'profile') { setLoading(false); return; }
    loadAccounts(tab);
  }, [tab]);

  const saveProfile = async () => {
    setError(''); setSuccess('');
    try { await authApi.updateProfile(profileForm); setSuccess('Your account details were updated.'); setProfileForm((f) => ({ ...f, currentPassword: '', newPassword: '' })); }
    catch (err) { setError(err.response?.data?.message || 'Failed to update profile'); }
  };

  const createAccount = async () => {
    setError('');
    try { await accountApi.createAccount({ ...accountForm, role: tab }); setModal(null); setSuccess('Account created.'); loadAccounts(tab); }
    catch (err) { setError(err.response?.data?.message || 'Failed to create account'); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Account Management</h1>
        {tab === 'STAKEHOLDER' && <button className="btn btn-danger" onClick={async () => { if (confirm('Deactivate ALL stakeholder accounts?')) { const res = await accountApi.deactivateAllStakeholders({}); setSuccess(res.data.message); loadAccounts('STAKEHOLDER'); } }}>Deactivate All Stakeholders</button>}
        {tab !== 'profile' && <button className="btn btn-primary" onClick={() => { setAccountForm({ ...emptyAccountForm, role: tab }); setModal('create'); }}>+ Create Account</button>}
      </div>
      <Alert message={error} /><Alert type="success" message={success} />
      <div className="tabs">
        {ROLE_TABS.map((t) => <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => { setTab(t.key); setError(''); setSuccess(''); }}>{t.label}</button>)}
      </div>
      {tab === 'profile' ? (
        <div className="card" style={{ maxWidth: 560 }}>
          <div className="card-title">My Account Details</div>
          <div className="form-row">
            <div className="form-group"><label>First Name</label><input className="form-control" value={profileForm.firstName} onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })} /></div>
            <div className="form-group"><label>Last Name</label><input className="form-control" value={profileForm.lastName} onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })} /></div>
          </div>
          <div className="form-group"><label>Email</label><input className="form-control" value={user?.email || ''} disabled /></div>
          <div className="form-group"><label>Company</label><input className="form-control" value={profileForm.companyName} onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })} /></div>
          <div className="form-group"><label>Phone</label><input className="form-control" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} /></div>
          <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid var(--gray-200)' }} />
          <div className="card-title">Change Password</div>
          <div className="form-group"><label>Current Password</label><input className="form-control" type="password" value={profileForm.currentPassword} onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })} /></div>
          <div className="form-group"><label>New Password</label><input className="form-control" type="password" value={profileForm.newPassword} onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })} /></div>
          <button className="btn btn-primary" onClick={saveProfile}>Save Changes</button>
        </div>
      ) : loading ? <Loading /> : (
        <div className="card">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Event</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {accounts.length === 0 ? <tr><td colSpan={6} className="empty-state">No accounts yet.</td></tr>
                : accounts.map((a) => (
                  <tr key={a.id}>
                    <td>{a.firstName} {a.lastName}</td><td>{a.email}</td><td>{a.phone || '—'}</td>
                    <td>{events.find((e) => e.id === a.eventId)?.title || '—'}</td>
                    <td><StatusBadge status={a.isActive ? 'ACTIVE' : 'INACTIVE'} /></td>
                    <td>{a.isActive && <button className="btn btn-danger btn-sm" onClick={async () => { if (confirm('Deactivate?')) { await accountApi.deactivateAccount(a.id); setSuccess('Account deactivated.'); loadAccounts(tab); } }}>Deactivate</button>}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      {modal === 'create' && (
        <Modal title={`Create ${tab.replace('_', ' ')} Account`} onClose={() => setModal(null)} onSubmit={createAccount} submitLabel="Create Account">
          <div className="form-group"><label>Email *</label><input className="form-control" type="email" value={accountForm.email} onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })} required /></div>
          <div className="form-group"><label>Password *</label><input className="form-control" type="password" value={accountForm.password} onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })} minLength={6} required /></div>
          <div className="form-row">
            <div className="form-group"><label>First Name *</label><input className="form-control" value={accountForm.firstName} onChange={(e) => setAccountForm({ ...accountForm, firstName: e.target.value })} required /></div>
            <div className="form-group"><label>Last Name *</label><input className="form-control" value={accountForm.lastName} onChange={(e) => setAccountForm({ ...accountForm, lastName: e.target.value })} required /></div>
          </div>
          <div className="form-group"><label>Phone</label><input className="form-control" value={accountForm.phone} onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })} /></div>
          <div className="form-group"><label>Link to Event (optional)</label>
            <select className="form-control" value={accountForm.eventId} onChange={(e) => setAccountForm({ ...accountForm, eventId: e.target.value })}>
              <option value="">None</option>{events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select></div>
        </Modal>
      )}
    </div>
  );
}
