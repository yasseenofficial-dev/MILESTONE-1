import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function GuestCheckIn() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [message, setMessage] = useState("");

  function handleCheckIn() {
    axios
      .post("http://localhost:5000/api/check-in", {
        guestName: "Ahmed El Sergani",
        qrCode: "GUEST-2026-001",
      })
      .then((response) => {
        setMessage(response.data.message);
        setCheckedIn(true);
      })
      .catch((error) => {
        if (error.response) {
          setMessage(error.response.data.message);
        } else {
          setMessage("Check-in failed.");
        }
      });
  }

  return (
    <div className="page">
      <div className="page-header">
        <Link className="back-link" to="/">
          ← Back to main page
        </Link>

        <h1 className="page-title">Event Check-In</h1>
        <p className="page-subtitle">
          Present your guest information at the entrance.
        </p>
      </div>

      <div className="content-card">
        <div className="detail-list">
          <div className="detail-item">
            <span className="detail-label">Guest Name</span>
            <span className="detail-value">Ahmed El Sergani</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Event</span>
            <span className="detail-value">Tech Networking Night</span>
          </div>
        </div>

        <div className="qr-box">
          <p>Guest QR Code</p>
          <div className="qr-code">GUEST-2026-001</div>
        </div>

        <button className="primary-button" onClick={handleCheckIn}>
          Confirm Check-In
        </button>

        {checkedIn && message && <div className="message-box">{message}</div>}
      </div>
    </div>
  );
}

export default GuestCheckIn;