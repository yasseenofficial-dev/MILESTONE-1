import { Link } from "react-router-dom";

function ClientNavbar() {
  return (
    <nav style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
      <Link to="/client/events" style={{ marginRight: 15 }}>Events</Link>
      <Link to="/client/requests" style={{ marginRight: 15 }}>Requests</Link>
      <Link to="/client/deliveries" style={{ marginRight: 15 }}>Deliveries</Link>
      <Link to="/client/invoices">Invoices</Link>
    </nav>
  );
}

export default ClientNavbar;
