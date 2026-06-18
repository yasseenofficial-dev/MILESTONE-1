import { useEffect, useState } from "react";
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

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Day-Of Communications</h1>

      <p>Here are the latest live updates from the event organizer.</p>

      {messages.map((message) => (
        <div key={message.id}>
          <h3>{message.title}</h3>
          <p>{message.text}</p>
          <p>Status: {message.status}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default GuestMessages;