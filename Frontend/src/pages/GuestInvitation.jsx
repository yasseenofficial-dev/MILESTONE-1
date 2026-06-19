import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function GuestInvitation() {
  const [invitation, setInvitation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/invitation")
      .then((response) => {
        setInvitation(response.data);
      })
      .catch(() => {
        setError("Failed to load invitation details.");
      });
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <Link className="back-link" to="/">
          ← Back to main page
        </Link>

        <h1 className="page-title">Event Invitation</h1>
        <p className="page-subtitle">
          Review your official invitation details.
        </p>
      </div>

      {error && <div className="error-box">{error}</div>}

      {!invitation && !error && (
        <div className="content-card">Loading invitation...</div>
      )}

      {invitation && (
        <div className="content-card">
          <h2>{invitation.eventName}</h2>

          <div className="detail-list">
            <div className="detail-item">
              <span className="detail-label">Date</span>
              <span className="detail-value">{invitation.date}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Time</span>
              <span className="detail-value">{invitation.time}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Venue</span>
              <span className="detail-value">{invitation.venue}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Dress Code</span>
              <span className="detail-value">{invitation.dressCode}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Agenda</span>
              <span className="detail-value">{invitation.agenda}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GuestInvitation;