import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import guestClient from '../../api/guestClient.js';

function GuestMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    guestClient.get('/messages').then(res => setMessages(res.data)).catch(() => setError('Failed to load messages.'));
  }, []);

  return (
    <div className="guest-page">
      <div className="guest-page-header">
        <Link className="guest-back-link" to="/guest">← Back to Guest Portal</Link>
        <h1 className="guest-page-title">Day-Of Communications</h1>
        <p className="guest-page-subtitle">Stay updated with live messages from the event organizer.</p>
      </div>
      {error && <div className="guest-error-box">{error}</div>}
      {messages.map(msg => (
        <div className="guest-message-card" key={msg.id}>
          <h3>{msg.title}</h3><p>{msg.text}</p>
          <span className="guest-status-pill">{msg.status}</span>
        </div>
      ))}
      {messages.length === 0 && !error && <div className="guest-content-card"><p>No messages at this time.</p></div>}
    </div>
  );
}

export default GuestMessagesPage;
