import { useEffect, useState } from "react";
import { getClientDeliveries } from "../api/clientApi";

function ClientDeliveries() {
  const [deliveries, setDeliveries] = useState([]);

  const fetchDeliveries = () => {
    getClientDeliveries().then(res => {
      setDeliveries(res.data.deliveries);
    });
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  return (
    <div className="container">
      <h2 style={{ marginBottom: "20px" }}>Delivery Tracking</h2>

      {deliveries.length === 0 && <p>No deliveries yet.</p>}

      {deliveries.map(del => (
        <div key={del.id} className="card">
          <p><strong>Event:</strong> {del.eventName}</p>
          <p><strong>Status:</strong> {del.status}</p>
          <p><strong>Location:</strong> {del.location}</p>
          <p><strong>Delivery Date:</strong> {del.deliveryDate}</p>

          {del.confirmedAt && (
            <p><strong>Confirmed At:</strong> {del.confirmedAt}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default ClientDeliveries;
