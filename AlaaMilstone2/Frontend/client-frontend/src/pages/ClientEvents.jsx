import { useEffect, useState } from "react";
import { getEvents, createEvent } from "../api/clientApi";

function ClientEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    eventName: "",
    date: "",
    location: "",
    totalGuests: ""
  });

  const fetchEvents = () => {
    getEvents().then(res => {
      setEvents(res.data.events);
    });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createEvent({
      eventName: form.eventName,
      date: form.date,
      location: form.location,
      totalGuests: form.totalGuests
    });

    fetchEvents();
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: "20px" }}>Client Events</h2>

      <form onSubmit={handleSubmit} className="card">
        <input
          type="text"
          placeholder="Event Name"
          value={form.eventName}
          onChange={(e) => setForm({ ...form, eventName: e.target.value })}
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <input
          type="number"
          placeholder="Total Guests"
          value={form.totalGuests}
          onChange={(e) => setForm({ ...form, totalGuests: e.target.value })}
        />

        <button type="submit">Create Event</button>
      </form>

      <h3 style={{ marginTop: "30px" }}>Your Events</h3>

      {events.length === 0 && <p>No events found.</p>}

      {events.map(ev => (
        <div key={ev.id} className="card">
          <p><strong>Name:</strong> {ev.eventName}</p>
          <p><strong>Date:</strong> {ev.date}</p>
          <p><strong>Location:</strong> {ev.location}</p>
          <p><strong>Total Guests:</strong> {ev.totalGuests}</p>
        </div>
      ))}
    </div>
  );
}

export default ClientEvents;
