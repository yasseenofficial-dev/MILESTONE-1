import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { staffApi, taskApi } from '../api';
import EventSubNav from '../components/EventSubNav';
import { Loading, Modal } from '../components/ui';

export default function StaffPage() {
  const { eventId } = useParams();
  const [staff, setStaff] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '' });

  const load = () => {
    setLoading(true);
    Promise.all([staffApi.getAll(eventId), taskApi.getTasks(eventId)])
      .then(([sRes, tRes]) => {
        setStaff(sRes.data.data);
        setTasks(tRes.data.data.filter((t) => !t.staffId));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [eventId]);

  const save = async () => {
    if (modal === 'add') await staffApi.create(eventId, form);
    else await staffApi.update(eventId, modal, form);
    setModal(null);
    load();
  };

  const assignTask = async (staffId, taskId) => {
    await staffApi.assignTask(eventId, staffId, taskId);
    load();
  };

  return (
    <div>
      <EventSubNav />
      <div className="page-header">
        <h1>Staff Management</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ name: '', email: '', phone: '', role: '' }); setModal('add'); }}>+ Add Staff</button>
      </div>

      {loading ? <Loading /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {staff.map((s) => (
            <div key={s.id} className="card">
              <h3 style={{ marginBottom: '0.25rem' }}>{s.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{s.role}</p>
              <p style={{ fontSize: '0.8rem' }}>{s.email || '—'} · {s.phone || '—'}</p>
              <div style={{ marginTop: '1rem' }}>
                <strong style={{ fontSize: '0.8rem' }}>Assigned Tasks ({s.tasks?.length || 0})</strong>
                <ul style={{ fontSize: '0.8rem', marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                  {(s.tasks || []).map((t) => <li key={t.id}>{t.title}</li>)}
                </ul>
              </div>
              {tasks.length > 0 && (
                <div style={{ marginTop: '0.75rem' }}>
                  <select className="form-control" style={{ fontSize: '0.8rem' }}
                    onChange={(e) => { if (e.target.value) { assignTask(s.id, e.target.value); e.target.value = ''; } }}>
                    <option value="">Assign task...</option>
                    {tasks.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select>
                </div>
              )}
              <div className="btn-group" style={{ marginTop: '1rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => { setForm(s); setModal(s.id); }}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={async () => { if (confirm('Remove?')) { await staffApi.remove(eventId, s.id); load(); } }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'Add Staff' : 'Edit Staff'} onClose={() => setModal(null)} onSubmit={save}>
          <div className="form-group"><label>Name</label>
            <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="form-group"><label>Role</label>
            <input className="form-control" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required /></div>
          <div className="form-group"><label>Email</label>
            <input className="form-control" type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="form-group"><label>Phone</label>
            <input className="form-control" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        </Modal>
      )}
    </div>
  );
}
