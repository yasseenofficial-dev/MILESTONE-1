import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page">
      <section className="hero">
        <p className="eyebrow">Guest Portal</p>
        <h1>Tech Networking Night</h1>
        <p className="hero-text">
          View your invitation, RSVP, receive event updates, check in, and submit
          post-event feedback.
        </p>
      </section>

      <section className="card-grid">
        <Link className="feature-card" to="/invitation">
          <span className="card-icon">✉️</span>
          <h2>Invitation</h2>
          <p>View event details, venue, dress code, and agenda.</p>
        </Link>

        <Link className="feature-card" to="/rsvp">
          <span className="card-icon">✅</span>
          <h2>RSVP</h2>
          <p>Confirm attendance and submit preferences.</p>
        </Link>

        <Link className="feature-card" to="/messages">
          <span className="card-icon">📢</span>
          <h2>Messages</h2>
          <p>Receive day-of updates from the organizer.</p>
        </Link>

        <Link className="feature-card" to="/check-in">
          <span className="card-icon">🎟️</span>
          <h2>Check-In</h2>
          <p>Show your guest information and confirm check-in.</p>
        </Link>

        <Link className="feature-card" to="/feedback">
          <span className="card-icon">⭐</span>
          <h2>Feedback</h2>
          <p>Submit your post-event experience review.</p>
        </Link>
      </section>
    </div>
  );
}

export default Home;