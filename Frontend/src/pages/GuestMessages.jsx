import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function GuestMessages() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/messages")
      .then((response) => {
        setMessages(response.data);
      })
      .catch(() => {
        setError("Failed to load messages.");
      });
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <Link className="back-link" to="/">
          ← Back to main page
        </Link>

        <h1 className="page-title">Day-Of Communications</h1>
        <p className="page-subtitle">
          Stay updated with live messages from the event organizer.
        </p>
      </div>

      {error && <div className="error-box">{error}</div>}

      {messages.map((message) => (
        <div className="message-card" key={message.id}>
          <h3>{message.title}</h3>
          <p>{message.text}</p>
          <span className="status-pill">{message.status}</span>
        </div>
      ))}
    </div>
  );
}

export default GuestMessages;