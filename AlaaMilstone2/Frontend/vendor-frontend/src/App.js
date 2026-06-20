import { BrowserRouter, Routes, Route } from "react-router-dom";
import VendorRequests from "./pages/VendorRequests";
import VendorDeliveries from "./pages/VendorDeliveries";
  

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Vendor App is working!</h1>} />

        <Route path="/vendor/requests" element={<VendorRequests />} />
        <Route path="/vendor/deliveries" element={<VendorDeliveries />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
