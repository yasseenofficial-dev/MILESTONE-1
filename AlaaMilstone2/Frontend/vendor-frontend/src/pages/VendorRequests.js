import { useEffect, useState } from "react";
import { getVendorRequests, acceptRequest } from "../api/vendorApi";

function VendorRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = () => {
    getVendorRequests().then(res => {
      setRequests(res.data.requests);
    });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    await acceptRequest(id);
    alert("Request accepted!");
    fetchRequests();
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: "20px" }}>Vendor Requests</h2>

      {requests.length === 0 && <p>No requests found.</p>}

      {requests.map(req => (
        <div key={req.id} className="card">
          <p><strong>Event:</strong> {req.eventName}</p>
          <p><strong>Status:</strong> {req.status}</p>

          <button onClick={() => handleAccept(req.id)}>
            Accept Request
          </button>
        </div>
      ))}
    </div>
  );
}

export default VendorRequests;
