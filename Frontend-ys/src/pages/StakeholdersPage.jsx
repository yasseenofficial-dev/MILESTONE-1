import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { stakeholderApi } from '../api';
import EventSubNav from '../components/EventSubNav';
import { Loading, Modal } from '../components/ui';

const ROLES = ['SPONSOR', 'PARTNER', 'SPEAKER', 'VOLUNTEER', 'CO_ORGANIZER', 'OTHER'];

export default function StakeholdersPage() {
  const { eventId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'OTHER', notes: '' });

  const load = () => {
    stakeholderApi.getAll(eventId).then((res) => setItems(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [eventId]);

  const openAdd = () => { setForm({ name: '', email: '', phone: '', role: 'OTHER', notes: '' }); setModal('add'); };
  const openEdit = (s) => { setForm(s); setModal(s.id); };

  const save = async () => {
    if (modal === 'add') {
      await stakeholderApi.create(eventId, form);
    } else {
      await stakeholderApi.update(eventId, modal, form);
    }
    setModal(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Remove stakeholder?')) return;
    await stakeholderApi.remove(eventId, id);
    load();
  };

  return (
    <div>
      <EventSubNav />
      <div className="page-header">
        <h1>Stakeholders</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Stakeholder</button>
      </div>

      {loading ? <Loading /> : (
        <div className="card">
          <table>
            <thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td><td>{s.role}</td><td>{s.email || '—'}</td><td>{s.phone || '—'}</td>
                  <td className="btn-group">
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(s.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'Add Stakeholder' : 'Edit Stakeholder'} onClose={() => setModal(null)} onSubmit={save}>
          <div className="form-group"><label>Name</label>
            <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="form-group"><label>Role</label>
            <select className="form-control" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select></div>
          <div className="form-group"><label>Email</label>
            <input className="form-control" type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="form-group"><label>Phone</label>
            <input className="form-control" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="form-group"><label>Notes</label>
            <textarea className="form-control" value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
        </Modal>
      )}
    </div>
  );
}
