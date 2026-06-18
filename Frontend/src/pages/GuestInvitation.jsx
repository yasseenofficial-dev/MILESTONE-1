import { useEffect, useState } from "react";
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

  if (error) {
    return <p>{error}</p>;
  }

  if (!invitation) {
    return <p>Loading invitation...</p>;
  }

  return (
    <div>
      <h1>Event Invitation</h1>

      <h2>{invitation.eventName}</h2>

      <p>Date: {invitation.date}</p>

      <p>Time: {invitation.time}</p>

      <p>Venue: {invitation.venue}</p>

      <p>Dress Code: {invitation.dressCode}</p>

      <p>Agenda: {invitation.agenda}</p>
    </div>
  );
}

export default GuestInvitation;