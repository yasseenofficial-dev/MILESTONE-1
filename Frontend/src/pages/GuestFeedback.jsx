import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function GuestFeedback() {
  const [overallExperience, setOverallExperience] = useState("");
  const [foodRating, setFoodRating] = useState("");
  const [venueRating, setVenueRating] = useState("");
  const [organizationRating, setOrganizationRating] = useState("");
  const [comments, setComments] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    axios
      .post("http://localhost:5000/api/feedback", {
        overallExperience,
        foodRating,
        venueRating,
        organizationRating,
        comments,
      })
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        if (error.response) {
          setMessage(error.response.data.message);
        } else {
          setMessage("Failed to submit feedback.");
        }
      });
  }

  return (
    <div className="page">
      <div className="page-header">
        <Link className="back-link" to="/">
          ← Back to main page
        </Link>

        <h1 className="page-title">Post-Event Feedback</h1>
        <p className="page-subtitle">
          Help us improve future events by sharing your experience.
        </p>
      </div>

      <div className="content-card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Overall Experience</label>
            <select
              value={overallExperience}
              onChange={(event) => setOverallExperience(event.target.value)}
            >
              <option value="">Select rating</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div className="form-group">
            <label>Food and Beverages</label>
            <select
              value={foodRating}
              onChange={(event) => setFoodRating(event.target.value)}
            >
              <option value="">Select rating</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div className="form-group">
            <label>Venue</label>
            <select
              value={venueRating}
              onChange={(event) => setVenueRating(event.target.value)}
            >
              <option value="">Select rating</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div className="form-group">
            <label>Organization</label>
            <select
              value={organizationRating}
              onChange={(event) => setOrganizationRating(event.target.value)}
            >
              <option value="">Select rating</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div className="form-group">
            <label>Open Comments</label>
            <textarea
              value={comments}
              onChange={(event) => setComments(event.target.value)}
              placeholder="Write your comments here..."
            />
          </div>

          <button className="primary-button" type="submit">
            Submit Feedback
          </button>
        </form>

        {message && <div className="message-box">{message}</div>}
      </div>
    </div>
  );
}

export default GuestFeedback;