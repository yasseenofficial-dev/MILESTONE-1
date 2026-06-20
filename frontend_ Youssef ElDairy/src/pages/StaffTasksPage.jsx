import { useEffect, useState } from 'react';
import api from '../api/client.js';
import PageHeader from '../components/PageHeader.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

const statuses = ['all', 'not started', 'pending', 'in progress', 'done', 'blocked'];

export default function StaffTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('all');
  const [notice, setNotice] = useState('');

  async function load() {
    const res = await api.get('/tasks', { params: { assignedToMe: true, status } });
    setTasks(res.data.tasks);
  }

  useEffect(() => { load(); }, [status]);

  async function updateTask(task, updates) {
    await api.patch(`/tasks/${task.id}`, updates);
    setNotice('Task updated successfully.');
    await load();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Journey 9"
        title="Assigned Operational Tasks"
        description="View assigned tasks, filter by status, and update completion progress."
      >
        <label className="field inline-field">
          <span>Status</span>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            {statuses.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </PageHeader>
      {notice && <div className="success-box">{notice}</div>}
      <section className="panel">
        <div className="cards-list">
          {tasks.map(task => (
            <div className="mini-card" key={task.id}>
              <div className="space-between"><strong>{task.title}</strong><StatusBadge value={task.status} /></div>
              <p>{task.event?.name} • {task.category} • Due {task.dueTime}</p>
              <label className="field">
                <span>Progress: {task.progress}%</span>
                <input type="range" min="0" max="100" defaultValue={task.progress} onMouseUp={(e) => updateTask(task, { progress: Number(e.currentTarget.value) })} />
              </label>
              <div className="row-gap">
                <button className="secondary-button" onClick={() => updateTask(task, { status: 'in progress' })}>Mark in progress</button>
                <button className="primary-button" onClick={() => updateTask(task, { status: 'done', progress: 100 })}>Mark done</button>
              </div>
              {task.note && <small>{task.note}</small>}
            </div>
          ))}
          {tasks.length === 0 && <p className="muted">No tasks found for this status.</p>}
        </div>
      </section>
    </div>
  );
}
