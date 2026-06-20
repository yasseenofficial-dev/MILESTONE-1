import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import StatusBadge from "../components/StatusBadge.jsx";

export default function BookingRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const [responding, setResponding] = useState(null); // request id currently being responded to
  const [responseMessage, setResponseMessage] = useState("");
  const [counterProposal, setCounterProposal] = useState("");

  function load() {
    api
      .getBookingRequests(filter)
      .then(setRequests)
      .catch((err) => setError(err.message));
  }

  useEffect(load, [filter]);

  async function handleRespond(request, decision) {
    try {
      await api.respondToRequest(request.id, {
        decision,
        message: responseMessage || null,
        counterProposal: decision === "Declined" ? counterProposal || null : null
      });
      setResponding(null);
      setResponseMessage("");
      setCounterProposal("");
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Booking Requests</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Declined">Declined</option>
        </select>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="grid">
        {requests.map((r) => (
          <div className="card" key={r.id}>
            <div className="listing-card-header">
              <h3>{r.eventType}</h3>
              <StatusBadge status={r.status} />
            </div>
            <p className="muted">{r.listingName}</p>
            <p>
              Organizer: <strong>{r.organizerName}</strong> ({r.organizerContact})
            </p>
            <p>Event date: {r.eventDate}</p>
            <p>Expected attendees: {r.expectedAttendees}</p>
            {r.specialRequirements && <p>Notes: {r.specialRequirements}</p>}
            {r.ownerMessage && <p className="muted">Your response: {r.ownerMessage}</p>}
            {r.counterProposal && <p className="muted">Counter-proposal: {r.counterProposal}</p>}

            {r.status === "Pending" && (
              <>
                {responding === r.id ? (
                  <div className="respond-box">
                    <textarea
                      placeholder="Optional message to the organizer"
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      rows={2}
                    />
                    <input
                      placeholder="Optional counter-proposal (e.g. alternate dates/pricing)"
                      value={counterProposal}
                      onChange={(e) => setCounterProposal(e.target.value)}
                    />
                    <div className="card-actions">
                      <button className="btn-primary" onClick={() => handleRespond(r, "Approved")}>
                        Approve
                      </button>
                      <button className="btn-danger" onClick={() => handleRespond(r, "Declined")}>
                        Decline
                      </button>
                      <button className="btn-link" onClick={() => setResponding(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button className="btn-primary" onClick={() => setResponding(r.id)}>
                    Respond
                  </button>
                )}
              </>
            )}
          </div>
        ))}
        {requests.length === 0 && <p className="muted">No booking requests found.</p>}
      </div>
    </div>
  );
}
