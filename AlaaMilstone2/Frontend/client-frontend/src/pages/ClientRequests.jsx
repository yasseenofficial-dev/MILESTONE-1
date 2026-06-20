import { useEffect, useState } from "react";
import { getEvents, getClientRequests, createRequest } from "../api/clientApi";

function ClientRequests() {
  const [events, setEvents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    eventId: "",
    items: "",
    notes: ""
  });

  const fetchData = () => {
    getEvents().then(res => setEvents(res.data.events));
    getClientRequests().then(res => setRequests(res.data.requests));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemsArray = form.items.split(",").map(item => ({
      name: item.trim(),
      quantity: 1
    }));

    await createRequest({
      eventId: parseInt(form.eventId),
      items: itemsArray,
      notes: form.notes
    });

    fetchData();
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: "20px" }}>Client Requests</h2>

      {/* Request Form */}
      <form onSubmit={handleSubmit} className="card">
        <select
          value={form.eventId}
          onChange={(e) => setForm({ ...form, eventId: e.target.value })}
        >
          <option value="">Select Event</option>
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>
              {ev.eventName}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Items (comma separated)"
          value={form.items}
          onChange={(e) => setForm({ ...form, items: e.target.value })}
        />

        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <button type="submit">Send Request</button>
      </form>

      {/* Requests List */}
      <h3 style={{ marginTop: "30px" }}>Your Requests</h3>

      {requests.length === 0 && <p>No requests found.</p>}

      {requests.map(req => (
        <div key={req.id} className="card">
          <p><strong>Event:</strong> {req.eventName}</p>
          <p><strong>Status:</strong> {req.status}</p>
          <p><strong>Items:</strong> {req.items.map(i => i.name).join(", ")}</p>
          <p><strong>Notes:</strong> {req.notes}</p>
        </div>
      ))}
    </div>
  );
}

export default ClientRequests;
