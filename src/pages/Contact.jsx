import "../styles/contact.css";

function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h2>Contact Us</h2>
        <p className="subtitle">We'd love to hear from you</p>

        <div className="contact-info">
          <div className="contact-item">
            <span className="icon">📧</span>
            <div>
              <h4>Email</h4>
              <p>support@foodfinder.com</p>
            </div>
          </div>

          <div className="contact-item">
            <span className="icon">📞</span>
            <div>
              <h4>Phone</h4>
              <p>+91 98765 43210</p>
            </div>
          </div>

          <div className="contact-item">
            <span className="icon">📍</span>
            <div>
              <h4>Address</h4>
              <p>Hyderabad, Telangana, India</p>
            </div>
          </div>
        </div>

        <div className="contact-form-section">
          <h3>Send us a message</h3>
          <form className="contact-form">
            <div className="form-group">
              <label>Your Name</label>
              <input type="text" placeholder="Enter your name" required />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="Enter your email" required />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input type="text" placeholder="What is this about?" required />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea rows="4" placeholder="Write your message here..." required></textarea>
            </div>

            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
