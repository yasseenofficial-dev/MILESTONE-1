import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { vendorApi } from '../api';
import EventSubNav from '../components/EventSubNav';
import { Loading, Modal, StatusBadge } from '../components/ui';

export default function VendorsPage() {
  const { eventId } = useParams();
  const [eventVendors, setEventVendors] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [sourcing, setSourcing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('vendors');
  const [modal, setModal] = useState(null);
  const [vendorForm, setVendorForm] = useState({ vendorId: '', contractAmount: '', notes: '' });
  const [sourcingForm, setSourcingForm] = useState({ vendorId: '', title: '', description: '', budget: '' });

  const load = () => {
    setLoading(true);
    Promise.all([
      vendorApi.getEventVendors(eventId),
      vendorApi.getCatalog(),
      vendorApi.getSourcing(eventId),
    ]).then(([evRes, catRes, srcRes]) => {
      setEventVendors(evRes.data.data);
      setCatalog(catRes.data.data);
      setSourcing(srcRes.data.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [eventId]);

  const addVendor = async () => {
    await vendorApi.addEventVendor(eventId, {
      ...vendorForm,
      contractAmount: vendorForm.contractAmount ? parseFloat(vendorForm.contractAmount) : null,
    });
    setModal(null);
    load();
  };

  const createSourcing = async () => {
    await vendorApi.createSourcing(eventId, {
      ...sourcingForm,
      budget: sourcingForm.budget ? parseFloat(sourcingForm.budget) : null,
    });
    setModal(null);
    load();
  };

  const updateDelivery = async (eventVendorId, deliveryId, status) => {
    await vendorApi.updateDelivery(eventId, deliveryId, { status });
    load();
  };

  const markInvoicePaid = async (invoiceId) => {
    await vendorApi.updateInvoice(eventId, invoiceId, { status: 'PAID' });
    load();
  };

  if (loading) return <><EventSubNav /><Loading /></>;

  return (
    <div>
      <EventSubNav />
      <div className="page-header">
        <h1>Vendor Management</h1>
        <div className="btn-group">
          <button className="btn btn-secondary" onClick={() => { setSourcingForm({ vendorId: '', title: '', description: '', budget: '' }); setModal('sourcing'); }}>+ Sourcing Request</button>
          <button className="btn btn-primary" onClick={() => { setVendorForm({ vendorId: '', contractAmount: '', notes: '' }); setModal('vendor'); }}>+ Add Vendor</button>
        </div>
      </div>

      <div className="tabs">
        {['vendors', 'sourcing', 'deliveries', 'invoices'].map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'vendors' && (
        <div className="card">
          <table>
            <thead><tr><th>Vendor</th><th>Category</th><th>Contract</th><th>Status</th><th>Rating</th></tr></thead>
            <tbody>
              {eventVendors.map((ev) => (
                <tr key={ev.id}>
                  <td>{ev.vendor.name}</td>
                  <td>{ev.vendor.category}</td>
                  <td>{ev.contractAmount ? `EGP ${ev.contractAmount.toLocaleString()}` : '—'}</td>
                  <td><StatusBadge status={ev.status} /></td>
                  <td>★ {ev.vendor.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'sourcing' && (
        <div className="card">
          <table>
            <thead><tr><th>Title</th><th>Vendor</th><th>Budget</th><th>Quote</th><th>Status</th></tr></thead>
            <tbody>
              {sourcing.map((s) => (
                <tr key={s.id}>
                  <td>{s.title}</td>
                  <td>{s.vendor.name}</td>
                  <td>{s.budget ? `EGP ${s.budget.toLocaleString()}` : '—'}</td>
                  <td>{s.quoteAmount ? `EGP ${s.quoteAmount.toLocaleString()}` : '—'}</td>
                  <td><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'deliveries' && (
        <div className="card">
          <table>
            <thead><tr><th>Vendor</th><th>Description</th><th>Scheduled</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {eventVendors.flatMap((ev) => (ev.deliveries || []).map((d) => (
                <tr key={d.id}>
                  <td>{ev.vendor.name}</td>
                  <td>{d.description}</td>
                  <td>{d.scheduledDate ? new Date(d.scheduledDate).toLocaleString() : '—'}</td>
                  <td><StatusBadge status={d.status} /></td>
                  <td>
                    {d.status !== 'DELIVERED' && (
                      <button className="btn btn-success btn-sm" style={{ background: 'var(--success)', color: 'white' }}
                        onClick={() => updateDelivery(ev.id, d.id, 'DELIVERED')}>Mark Delivered</button>
                    )}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'invoices' && (
        <div className="card">
          <table>
            <thead><tr><th>Invoice #</th><th>Vendor</th><th>Amount</th><th>Due</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {eventVendors.flatMap((ev) => (ev.invoices || []).map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.invoiceNumber}</td>
                  <td>{ev.vendor.name}</td>
                  <td>EGP {inv.amount.toLocaleString()}</td>
                  <td>{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}</td>
                  <td><StatusBadge status={inv.status} /></td>
                  <td>
                    {inv.status !== 'PAID' && (
                      <button className="btn btn-primary btn-sm" onClick={() => markInvoicePaid(inv.id)}>Mark Paid</button>
                    )}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      )}

      {modal === 'vendor' && (
        <Modal title="Add Vendor to Event" onClose={() => setModal(null)} onSubmit={addVendor}>
          <div className="form-group"><label>Vendor</label>
            <select className="form-control" value={vendorForm.vendorId} onChange={(e) => setVendorForm({ ...vendorForm, vendorId: e.target.value })} required>
              <option value="">Select vendor</option>
              {catalog.map((v) => <option key={v.id} value={v.id}>{v.name} ({v.category})</option>)}
            </select></div>
          <div className="form-group"><label>Contract Amount</label>
            <input className="form-control" type="number" value={vendorForm.contractAmount} onChange={(e) => setVendorForm({ ...vendorForm, contractAmount: e.target.value })} /></div>
          <div className="form-group"><label>Notes</label>
            <textarea className="form-control" value={vendorForm.notes} onChange={(e) => setVendorForm({ ...vendorForm, notes: e.target.value })} /></div>
        </Modal>
      )}

      {modal === 'sourcing' && (
        <Modal title="New Sourcing Request" onClose={() => setModal(null)} onSubmit={createSourcing}>
          <div className="form-group"><label>Vendor</label>
            <select className="form-control" value={sourcingForm.vendorId} onChange={(e) => setSourcingForm({ ...sourcingForm, vendorId: e.target.value })} required>
              <option value="">Select vendor</option>
              {catalog.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select></div>
          <div className="form-group"><label>Title</label>
            <input className="form-control" value={sourcingForm.title} onChange={(e) => setSourcingForm({ ...sourcingForm, title: e.target.value })} required /></div>
          <div className="form-group"><label>Description</label>
            <textarea className="form-control" value={sourcingForm.description} onChange={(e) => setSourcingForm({ ...sourcingForm, description: e.target.value })} /></div>
          <div className="form-group"><label>Budget (EGP)</label>
            <input className="form-control" type="number" value={sourcingForm.budget} onChange={(e) => setSourcingForm({ ...sourcingForm, budget: e.target.value })} /></div>
        </Modal>
      )}
    </div>
  );
}
