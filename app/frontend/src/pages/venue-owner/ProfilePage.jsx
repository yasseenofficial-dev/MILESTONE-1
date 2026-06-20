import React, { useState } from 'react';
import { useVenueOwnerAuth } from '../../context/VenueOwnerAuthContext.jsx';
import { api } from '../../api/venueOwnerApi.js';

export default function ProfilePage() {
  const { owner, setOwner } = useVenueOwnerAuth();
  const [form, setForm] = useState({ ownerName: owner?.ownerName || '', companyName: owner?.companyName || '', phone: owner?.phone || '' });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave(e) {
    e.preventDefault(); setSaving(true); setMessage('');
    try { const updated = await api.updateProfile(form); setOwner(updated); setMessage('Profile updated successfully.'); }
    catch (err) { setMessage(err.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="page">
      <h1>My Profile</h1>
      <p className="page-subtitle">{owner?.email}</p>
      <form className="card form" onSubmit={handleSave}>
        {message && <div className="alert info">{message}</div>}
        <label>Owner name</label><input value={form.ownerName} onChange={e => setForm(f => ({ ...f, ownerName: e.target.value }))} required />
        <label>Company name</label><input value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} />
        <label>Phone</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
      </form>
    </div>
  );
}
