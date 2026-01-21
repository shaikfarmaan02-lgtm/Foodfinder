import { useState } from "react";
import "../styles/feedback.css";

function Feedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your feedback!");
  };

  return (
    <div className="feedback-page">
      <div className="feedback-container">
        <h2>Share Your Feedback</h2>
        <p className="subtitle">Help us improve Food Finder</p>

        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>How would you rate your experience?</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= (hover || rating) ? "active" : ""}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>What type of feedback do you have?</label>
            <select required>
              <option value="">Select feedback type</option>
              <option value="suggestion">Suggestion</option>
              <option value="bug">Bug Report</option>
              <option value="compliment">Compliment</option>
              <option value="complaint">Complaint</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Your Feedback</label>
            <textarea 
              rows="5" 
              placeholder="Tell us what you think about Food Finder..."
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Email (optional)</label>
            <input type="email" placeholder="Enter email for follow-up" />
          </div>

          <button type="submit">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
}

export default Feedback;
