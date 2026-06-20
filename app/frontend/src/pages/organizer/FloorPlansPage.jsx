import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { floorPlanApi } from '../../api/index.js';
import EventSubNav from '../../components/organizer/EventSubNav.jsx';
import { Loading } from '../../components/organizer/ui.jsx';

const OBJECT_TYPES = [
  { type: 'table', label: 'Table', width: 80, height: 80 },
  { type: 'stage', label: 'Stage', width: 200, height: 80 },
  { type: 'booth', label: 'Booth', width: 120, height: 100 },
  { type: 'entrance', label: 'Entrance', width: 100, height: 40 },
  { type: 'bar', label: 'Bar', width: 100, height: 60 },
];

export default function FloorPlansPage() {
  const { eventId } = useParams();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    floorPlanApi.getAll(eventId).then((res) => setPlans(res.data.data)).finally(() => setLoading(false));
  }, [eventId]);

  const createPlan = async () => {
    const res = await floorPlanApi.create(eventId, { name: `Floor Plan ${plans.length + 1}` });
    setPlans([res.data.data, ...plans]);
  };

  return (
    <div>
      <EventSubNav />
      <div className="page-header">
        <h1>Floor Plans</h1>
        <button className="btn btn-primary" onClick={createPlan}>+ New Floor Plan</button>
      </div>
      {loading ? <Loading /> : (
        <div className="card">
          <table>
            <thead><tr><th>Name</th><th>Size</th><th>Updated</th><th>Actions</th></tr></thead>
            <tbody>
              {plans.length === 0 ? <tr><td colSpan={4} className="empty-state">No floor plans yet</td></tr>
                : plans.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td><td>{p.width} × {p.height}</td>
                    <td>{new Date(p.updatedAt).toLocaleDateString()}</td>
                    <td><Link to={`/events/${eventId}/floor-plans/${p.id}`} className="btn btn-primary btn-sm">Open Designer</Link></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function FloorPlanDesignerPage() {
  const { eventId, planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [objects, setObjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dragging, setDragging] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    floorPlanApi.get(eventId, planId).then((res) => {
      const p = res.data.data;
      setPlan(p);
      setObjects(p.canvasData?.objects || []);
    });
  }, [eventId, planId]);

  const save = async () => {
    await floorPlanApi.update(eventId, planId, { name: plan.name, canvasData: { objects }, width: plan.width, height: plan.height });
    alert('Floor plan saved!');
  };

  const addObject = (typeDef) => {
    setObjects((prev) => [...prev, { id: Date.now(), type: typeDef.type, label: typeDef.label, x: 50 + prev.length * 20, y: 50 + prev.length * 20, width: typeDef.width, height: typeDef.height }]);
  };

  const handleMouseDown = (e, obj) => {
    e.stopPropagation();
    setSelected(obj.id);
    const rect = canvasRef.current.getBoundingClientRect();
    setDragging({ id: obj.id, offsetX: e.clientX - rect.left - obj.x, offsetY: e.clientY - rect.top - obj.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, e.clientX - rect.left - dragging.offsetX);
    const y = Math.max(0, e.clientY - rect.top - dragging.offsetY);
    setObjects((prev) => prev.map((o) => o.id === dragging.id ? { ...o, x, y } : o));
  };

  if (!plan) return <Loading />;

  return (
    <div>
      <EventSubNav />
      <div className="page-header">
        <h1>{plan.name}</h1>
        <div className="btn-group">
          <button className="btn btn-secondary" onClick={save}>Save</button>
        </div>
      </div>
      <div className="toolbar">
        {OBJECT_TYPES.map((t) => <button key={t.type} className="btn btn-secondary btn-sm" onClick={() => addObject(t)}>+ {t.label}</button>)}
        {selected && <button className="btn btn-danger btn-sm" onClick={() => { setObjects((prev) => prev.filter((o) => o.id !== selected)); setSelected(null); }}>Delete Selected</button>}
      </div>
      <div ref={canvasRef} className="floor-plan-canvas" style={{ width: plan.width, height: plan.height }}
        onMouseMove={handleMouseMove} onMouseUp={() => setDragging(null)} onMouseLeave={() => setDragging(null)} onClick={() => setSelected(null)}>
        {objects.map((obj) => (
          <div key={obj.id} className="floor-object"
            style={{ left: obj.x, top: obj.y, width: obj.width, height: obj.height, borderColor: selected === obj.id ? 'var(--danger)' : 'var(--primary)', background: selected === obj.id ? 'rgba(220,38,38,0.15)' : 'rgba(79,70,229,0.15)' }}
            onMouseDown={(e) => handleMouseDown(e, obj)}>
            {obj.label}
          </div>
        ))}
      </div>
    </div>
  );
}
