export default function EventSelector({ events, value, onChange, label = 'Event' }) {
  return (
    <label className="field inline-field">
      <span>{label}</span>
      <select value={value || ''} onChange={(e) => onChange(e.target.value)}>
        {events.map(event => (
          <option key={event.id} value={event.id}>{event.name} — {event.date}</option>
        ))}
      </select>
    </label>
  );
}
