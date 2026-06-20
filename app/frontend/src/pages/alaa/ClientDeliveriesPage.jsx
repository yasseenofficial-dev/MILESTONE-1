import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClientDeliveries } from '../../api/alaaClientApi.js';

function ClientDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  useEffect(() => { getClientDeliveries().then(res => setDeliveries(res.data.deliveries)); }, []);

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <Link to="/" style={{ color: '#d97706', fontWeight: 700 }}>← Home</Link>
        <h2>Delivery Tracking</h2>
      </div>
      {deliveries.length === 0 && <p>No deliveries yet.</p>}
      {deliveries.map(del => (
        <div key={del.id} className="card">
          <p><strong>Event:</strong> {del.eventName}</p>
          <p><strong>Status:</strong> {del.status}</p>
          <p><strong>Location:</strong> {del.location}</p>
          <p><strong>Delivery Date:</strong> {del.deliveryDate}</p>
          {del.confirmedAt && <p><strong>Confirmed At:</strong> {del.confirmedAt}</p>}
        </div>
      ))}
    </div>
  );
}

export default ClientDeliveriesPage;
