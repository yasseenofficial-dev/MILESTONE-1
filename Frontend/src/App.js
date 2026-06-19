import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import GuestInvitation from "./pages/GuestInvitation";
import GuestRSVP from "./pages/GuestRSVP";
import GuestMessages from "./pages/GuestMessages";
import GuestCheckIn from "./pages/GuestCheckIn";
import GuestFeedback from "./pages/GuestFeedback";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/invitation" element={<GuestInvitation />} />
          <Route path="/rsvp" element={<GuestRSVP />} />
          <Route path="/messages" element={<GuestMessages />} />
          <Route path="/check-in" element={<GuestCheckIn />} />
          <Route path="/feedback" element={<GuestFeedback />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;