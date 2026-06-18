import { useState } from "react";
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
    <div>
      <h1>Post-Event Feedback</h1>

      <p>Please complete the feedback form about your event experience.</p>

      <form onSubmit={handleSubmit}>
        <label>Overall Experience:</label>
        <br />
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

        <br />
        <br />

        <label>Food and Beverages:</label>
        <br />
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

        <br />
        <br />

        <label>Venue:</label>
        <br />
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

        <br />
        <br />

        <label>Organization:</label>
        <br />
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

        <br />
        <br />

        <label>Open Comments:</label>
        <br />
        <textarea
          value={comments}
          onChange={(event) => setComments(event.target.value)}
          placeholder="Write your comments here..."
        />

        <br />
        <br />

        <button type="submit">Submit Feedback</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default GuestFeedback;