import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import GuestInvitation from "./pages/GuestInvitation";
import GuestRSVP from "./pages/GuestRSVP";
import GuestMessages from "./pages/GuestMessages";
import GuestCheckIn from "./pages/GuestCheckIn";
import GuestFeedback from "./pages/GuestFeedback";

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <Link to="/invitation">Invitation</Link> |{" "}
          <Link to="/rsvp">RSVP</Link> |{" "}
          <Link to="/messages">Messages</Link> |{" "}
          <Link to="/check-in">Check-In</Link> |{" "}
          <Link to="/feedback">Feedback</Link>
        </nav>

        <Routes>
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