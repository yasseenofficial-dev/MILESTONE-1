import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getVendorRequests, acceptRequest, declineRequest } from '../../api/alaaVendorApi.js';

function VendorRequestsPage() {
  const [requests, setRequests] = useState([]);
  const fetchRequests = () => getVendorRequests().then(res => setRequests(res.data.requests));
  useEffect(() => { fetchRequests(); }, []);

  const handleAccept = async (id) => { await acceptRequest(id); alert('Request accepted!'); fetchRequests(); };
  const handleDecline = async (id) => { await declineRequest(id); fetchRequests(); };

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <Link to="/" style={{ color: '#d97706', fontWeight: 700 }}>← Home</Link>
        <h2>Vendor Requests</h2>
      </div>
      {requests.length === 0 && <p>No requests found.</p>}
      {requests.map(req => (
        <div key={req.id} className="card">
          <p><strong>Event:</strong> {req.eventName}</p>
          <p><strong>Status:</strong> {req.status}</p>
          <p><strong>Items:</strong> {req.items?.map(i => i.name).join(', ')}</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button onClick={() => handleAccept(req.id)}>Accept</button>
            <button onClick={() => handleDecline(req.id)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>Decline</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VendorRequestsPage;
