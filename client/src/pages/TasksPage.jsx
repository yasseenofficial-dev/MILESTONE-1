import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { taskApi, staffApi } from '../api';
import EventSubNav from '../components/EventSubNav';
import { Loading, Modal, StatusBadge } from '../components/ui';

export default function TasksPage() {
  const { eventId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', reminderAt: '', staffId: '',
  });

  const load = () => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    Promise.all([
      taskApi.getTasks(eventId, params),
      staffApi.getAll(eventId),
    ]).then(([tRes, sRes]) => {
      setTasks(tRes.data.data);
      setStaff(sRes.data.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [eventId, filters]);

  const openAdd = () => {
    setForm({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', reminderAt: '', staffId: '' });
    setModal('add');
  };

  const save = async () => {
    const payload = { ...form, staffId: form.staffId || null };
    if (modal === 'add') await taskApi.create(eventId, payload);
    else await taskApi.update(eventId, modal, payload);
    setModal(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete task?')) return;
    await taskApi.remove(eventId, id);
    load();
  };

  return (
    <div>
      <EventSubNav />
      <div className="page-header">
        <h1>Tasks & Reminders</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Task</button>
      </div>

      <div className="filters-bar">
        <div className="form-group">
          <label>Status</label>
          <select className="form-control" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All</option>
            {['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Priority</label>
          <select className="form-control" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
            <option value="">All</option>
            {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {loading ? <Loading /> : (
        <div className="card">
          <table>
            <thead><tr><th>Task</th><th>Assigned To</th><th>Priority</th><th>Status</th><th>Due</th><th>Reminder</th><th>Actions</th></tr></thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td>{t.staff?.name || '—'}</td>
                  <td><StatusBadge status={t.priority} /></td>
                  <td><StatusBadge status={t.status} /></td>
                  <td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</td>
                  <td>{t.reminderAt ? new Date(t.reminderAt).toLocaleString() : '—'}</td>
                  <td className="btn-group">
                    <button className="btn btn-secondary btn-sm" onClick={() => { setForm({ ...t, dueDate: t.dueDate?.slice(0, 16) || '', reminderAt: t.reminderAt?.slice(0, 16) || '', staffId: t.staffId || '' }); setModal(t.id); }}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(t.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'Add Task' : 'Edit Task'} onClose={() => setModal(null)} onSubmit={save}>
          <div className="form-group"><label>Title</label>
            <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
          <div className="form-group"><label>Description</label>
            <textarea className="form-control" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="form-row">
            <div className="form-group"><label>Status</label>
              <select className="form-control" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select></div>
            <div className="form-group"><label>Priority</label>
              <select className="form-control" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((p) => <option key={p} value={p}>{p}</option>)}
              </select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Due Date</label>
              <input className="form-control" type="datetime-local" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></div>
            <div className="form-group"><label>Reminder</label>
              <input className="form-control" type="datetime-local" value={form.reminderAt} onChange={(e) => setForm({ ...form, reminderAt: e.target.value })} /></div>
          </div>
          <div className="form-group"><label>Assign to Staff</label>
            <select className="form-control" value={form.staffId} onChange={(e) => setForm({ ...form, staffId: e.target.value })}>
              <option value="">Unassigned</option>
              {staff.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
            </select></div>
        </Modal>
      )}
    </div>
  );
}
