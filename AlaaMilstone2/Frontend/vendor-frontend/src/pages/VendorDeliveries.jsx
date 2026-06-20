import { useEffect, useState } from "react";
import { getDeliveries, updateDeliveryStatus, confirmDelivery } from "../api/vendorApi";

function VendorDeliveries() {
  const [deliveries, setDeliveries] = useState([]);

  const fetchDeliveries = () => {
    getDeliveries().then(res => {
      setDeliveries(res.data.deliveries);
    });
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await updateDeliveryStatus(id, newStatus);
    fetchDeliveries();
  };

  const handleConfirm = async (id) => {
    await confirmDelivery(id);
    fetchDeliveries();
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: "20px" }}>Vendor Deliveries</h2>

      {deliveries.length === 0 && <p>No deliveries found.</p>}

      {deliveries.map(del => (
        <div key={del.id} className="card">
          <p><strong>Event:</strong> {del.eventName}</p>
          <p><strong>Status:</strong> {del.status}</p>

          <button onClick={() => handleStatusChange(del.id, "Preparing")}>
            Mark as Preparing
          </button>

          <button onClick={() => handleStatusChange(del.id, "Out for Delivery")}>
            Mark as Out for Delivery
          </button>

          <button onClick={() => handleStatusChange(del.id, "Delivered")}>
            Mark as Delivered
          </button>

          <button onClick={() => handleConfirm(del.id)}>
            Confirm Delivery
          </button>
        </div>
      ))}
    </div>
  );
}

export default VendorDeliveries;
