import { useState } from "react";
import { Link } from "react-router-dom";
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
    <div className="page">
      <div className="page-header">
        <Link className="back-link" to="/">
          ← Back to main page
        </Link>

        <h1 className="page-title">RSVP</h1>
        <p className="page-subtitle">
          Confirm your attendance and share any preferences.
        </p>
      </div>

      <div className="content-card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Attendance Status</label>
            <select
              value={attendance}
              onChange={(event) => setAttendance(event.target.value)}
            >
              <option value="">Select an option</option>
              <option value="Attending">Attending</option>
              <option value="Not Attending">Not Attending</option>
              <option value="Maybe">Maybe</option>
            </select>
          </div>

          <div className="form-group">
            <label>Dietary Preferences</label>
            <input
              type="text"
              value={dietaryPreference}
              onChange={(event) => setDietaryPreference(event.target.value)}
              placeholder="Example: Vegetarian, no nuts, halal"
            />
          </div>

          <div className="form-group">
            <label>Special Requirements</label>
            <textarea
              value={specialRequirements}
              onChange={(event) => setSpecialRequirements(event.target.value)}
              placeholder="Example: Wheelchair access, seating request"
            />
          </div>

          <button className="primary-button" type="submit">
            Submit RSVP
          </button>
        </form>

        {message && <div className="message-box">{message}</div>}
      </div>
    </div>
  );
}

export default GuestRSVP;