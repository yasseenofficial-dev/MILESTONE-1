import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { budgetApi, vendorApi } from '../api';
import EventSubNav from '../components/EventSubNav';
import { Loading, Modal } from '../components/ui';

export default function BudgetPage() {
  const { eventId } = useParams();
  const [data, setData] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [catForm, setCatForm] = useState({ name: '', plannedAmount: '' });
  const [expForm, setExpForm] = useState({ description: '', amount: '', budgetCategoryId: '', vendorId: '', expenseDate: '' });

  const load = () => {
    setLoading(true);
    Promise.all([budgetApi.getBudget(eventId), vendorApi.getCatalog()])
      .then(([bRes, vRes]) => {
        setData(bRes.data.data);
        setVendors(vRes.data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [eventId]);

  const saveCategory = async () => {
    await budgetApi.createCategory(eventId, { ...catForm, plannedAmount: parseFloat(catForm.plannedAmount) });
    setModal(null);
    load();
  };

  const saveExpense = async () => {
    await budgetApi.createExpense(eventId, {
      ...expForm,
      amount: parseFloat(expForm.amount),
      budgetCategoryId: expForm.budgetCategoryId || null,
      vendorId: expForm.vendorId || null,
    });
    setModal(null);
    load();
  };

  if (loading) return <Loading />;
  const { categories, expenses, summary } = data;

  return (
    <div>
      <EventSubNav />
      <div className="page-header">
        <h1>Budget & Expenses</h1>
        <div className="btn-group">
          <button className="btn btn-secondary" onClick={() => { setCatForm({ name: '', plannedAmount: '' }); setModal('category'); }}>+ Category</button>
          <button className="btn btn-primary" onClick={() => { setExpForm({ description: '', amount: '', budgetCategoryId: '', vendorId: '', expenseDate: '' }); setModal('expense'); }}>+ Expense</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="label">Planned</div><div className="value" style={{ fontSize: '1.5rem' }}>EGP {summary.totalPlanned.toLocaleString()}</div></div>
        <div className="stat-card"><div className="label">Actual</div><div className="value" style={{ fontSize: '1.5rem' }}>EGP {summary.totalActual.toLocaleString()}</div></div>
        <div className="stat-card"><div className="label">Variance</div><div className="value" style={{ fontSize: '1.5rem', color: summary.variance >= 0 ? 'var(--success)' : 'var(--danger)' }}>EGP {summary.variance.toLocaleString()}</div></div>
        <div className="stat-card"><div className="label">Used</div><div className="value" style={{ fontSize: '1.5rem' }}>{summary.percentUsed}%</div></div>
      </div>

      <div className="card">
        <div className="card-title">Budget Categories</div>
        <table>
          <thead><tr><th>Category</th><th>Planned</th><th>Actual</th><th>Remaining</th></tr></thead>
          <tbody>
            {categories.map((c) => {
              const actual = c.expenses.reduce((s, e) => s + e.amount, 0);
              return (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>EGP {c.plannedAmount.toLocaleString()}</td>
                  <td>EGP {actual.toLocaleString()}</td>
                  <td>EGP {(c.plannedAmount - actual).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="card-title">Expenses</div>
        <table>
          <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Vendor</th><th>Amount</th><th></th></tr></thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id}>
                <td>{new Date(e.expenseDate).toLocaleDateString()}</td>
                <td>{e.description}</td>
                <td>{e.budgetCategory?.name || '—'}</td>
                <td>{e.vendor?.name || '—'}</td>
                <td>EGP {e.amount.toLocaleString()}</td>
                <td><button className="btn btn-danger btn-sm" onClick={async () => { await budgetApi.deleteExpense(eventId, e.id); load(); }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal === 'category' && (
        <Modal title="Add Budget Category" onClose={() => setModal(null)} onSubmit={saveCategory}>
          <div className="form-group"><label>Name</label>
            <input className="form-control" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} required /></div>
          <div className="form-group"><label>Planned Amount (EGP)</label>
            <input className="form-control" type="number" value={catForm.plannedAmount} onChange={(e) => setCatForm({ ...catForm, plannedAmount: e.target.value })} required /></div>
        </Modal>
      )}

      {modal === 'expense' && (
        <Modal title="Record Expense" onClose={() => setModal(null)} onSubmit={saveExpense}>
          <div className="form-group"><label>Description</label>
            <input className="form-control" value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} required /></div>
          <div className="form-group"><label>Amount (EGP)</label>
            <input className="form-control" type="number" value={expForm.amount} onChange={(e) => setExpForm({ ...expForm, amount: e.target.value })} required /></div>
          <div className="form-group"><label>Category</label>
            <select className="form-control" value={expForm.budgetCategoryId} onChange={(e) => setExpForm({ ...expForm, budgetCategoryId: e.target.value })}>
              <option value="">None</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select></div>
          <div className="form-group"><label>Vendor</label>
            <select className="form-control" value={expForm.vendorId} onChange={(e) => setExpForm({ ...expForm, vendorId: e.target.value })}>
              <option value="">None</option>
              {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select></div>
        </Modal>
      )}
    </div>
  );
}
