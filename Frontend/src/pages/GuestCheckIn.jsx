import { useState } from "react";
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
    <div>
      <h1>Event Check-In</h1>

      <p>Name: Ahmed El Sergani</p>
      <p>Event: Tech Networking Night</p>
      <p>QR Code: GUEST-2026-001</p>

      <button onClick={handleCheckIn}>
        Confirm Check-In
      </button>

      {checkedIn && <p>{message}</p>}
    </div>
  );
}

export default GuestCheckIn;