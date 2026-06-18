import { useState } from "react";
import axios from "axios";

function GuestRSVP() {
  const [attendance, setAttendance] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    axios
      .post("http://localhost:5000/api/rsvp", {
        attendance,
        dietaryPreference,
        specialRequirements,
      })
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        if (error.response) {
          setMessage(error.response.data.message);
        } else {
          setMessage("Failed to submit RSVP.");
        }
      });
  }

  return (
    <div>
      <h1>RSVP</h1>

      <p>Please confirm whether you will attend the event.</p>

      <form onSubmit={handleSubmit}>
        <label>Attendance Status:</label>
        <br />

        <select
          value={attendance}
          onChange={(event) => setAttendance(event.target.value)}
        >
          <option value="">Select an option</option>
          <option value="Attending">Attending</option>
          <option value="Not Attending">Not Attending</option>
          <option value="Maybe">Maybe</option>
        </select>

        <br />
        <br />

        <label>Dietary Preferences:</label>
        <br />

        <input
          type="text"
          value={dietaryPreference}
          onChange={(event) => setDietaryPreference(event.target.value)}
          placeholder="Example: Vegetarian, no nuts, halal"
        />

        <br />
        <br />

        <label>Special Requirements:</label>
        <br />

        <textarea
          value={specialRequirements}
          onChange={(event) => setSpecialRequirements(event.target.value)}
          placeholder="Example: Wheelchair access, seating request"
        />

        <br />
        <br />

        <button type="submit">Submit RSVP</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default GuestRSVP;