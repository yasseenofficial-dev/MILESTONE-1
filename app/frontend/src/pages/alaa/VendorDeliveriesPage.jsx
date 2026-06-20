import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDeliveries, updateDeliveryStatus, confirmDelivery } from '../../api/alaaVendorApi.js';

function VendorDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const fetchDeliveries = () => getDeliveries().then(res => setDeliveries(res.data.deliveries));
  useEffect(() => { fetchDeliveries(); }, []);

  const handleStatusChange = async (id, newStatus) => { await updateDeliveryStatus(id, newStatus); fetchDeliveries(); };
  const handleConfirm = async (id) => { await confirmDelivery(id); fetchDeliveries(); };

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <Link to="/" style={{ color: '#d97706', fontWeight: 700 }}>← Home</Link>
        <h2>Vendor Deliveries</h2>
      </div>
      {deliveries.length === 0 && <p>No deliveries found.</p>}
      {deliveries.map(del => (
        <div key={del.id} className="card">
          <p><strong>Event:</strong> {del.eventName}</p>
          <p><strong>Status:</strong> {del.status}</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
            <button onClick={() => handleStatusChange(del.id, 'Preparing')}>Preparing</button>
            <button onClick={() => handleStatusChange(del.id, 'Out for Delivery')}>Out for Delivery</button>
            <button onClick={() => handleStatusChange(del.id, 'Delivered')}>Delivered</button>
            <button onClick={() => handleConfirm(del.id)} style={{ background: '#059669', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>Confirm</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VendorDeliveriesPage;
