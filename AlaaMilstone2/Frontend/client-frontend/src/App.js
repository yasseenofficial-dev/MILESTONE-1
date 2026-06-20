import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientEvents from "./pages/ClientEvents";
import ClientRequests from "./pages/ClientRequests";
import ClientDeliveries from "./pages/ClientDeliveries";
import ClientInvoices from "./pages/ClientInvoices";
import ClientNavbar from "./components/ClientNavbar.jsx";
import "./App.css";


function App() {
  return (
    <BrowserRouter>

      {/* Add the navbar here */}
      <ClientNavbar />

      <Routes>
        <Route path="/client/events" element={<ClientEvents />} />
        <Route path="/client/requests" element={<ClientRequests />} />
        <Route path="/client/deliveries" element={<ClientDeliveries />} />
        <Route path="/client/invoices" element={<ClientInvoices />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
