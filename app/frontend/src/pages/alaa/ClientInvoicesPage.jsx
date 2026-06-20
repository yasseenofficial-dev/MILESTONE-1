import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClientInvoices } from '../../api/alaaClientApi.js';

function ClientInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  useEffect(() => { getClientInvoices().then(res => setInvoices(res.data.invoices)); }, []);

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <Link to="/" style={{ color: '#d97706', fontWeight: 700 }}>← Home</Link>
        <h2>My Invoices</h2>
      </div>
      {invoices.length === 0 ? <p>No invoices found.</p> : invoices.map(invoice => (
        <div key={invoice.id} className="card">
          <h3>Invoice #{invoice.id}</h3>
          <p><strong>Amount:</strong> ${invoice.amount}</p>
          <p><strong>Date:</strong> {invoice.date}</p>
          <p><strong>Status:</strong> <span style={{ color: invoice.status === 'Paid' ? 'green' : 'orange', fontWeight: 'bold' }}>{invoice.status}</span></p>
        </div>
      ))}
    </div>
  );
}

export default ClientInvoicesPage;
