import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        {/* Floating bubbles */}
        <div className="hero-bubbles" aria-hidden="true">
          <div className="bubble bubble-1" />
          <div className="bubble bubble-2" />
          <div className="bubble bubble-3" />
          <div className="bubble bubble-4" />
          <div className="bubble bubble-5" />
          <div className="bubble bubble-6" />
          <div className="bubble bubble-7" />
          <div className="bubble bubble-8" />
        </div>
        <div className="home-content">
          <h1>No Food Waste. No Hunger.</h1>
          <p>
            Find free or affordable food near you from hotels,
            hostels, schools, functions, and restaurants.
          </p>
          <div className="hero-buttons">
            <Link to="/find-food" className="btn-primary">Find Food Near You</Link>
            <Link to="/register" className="btn-secondary">Join as Giver</Link>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works">
        <h2>How Food Finder Works</h2>
        <p className="section-subtitle">A simple process to reduce food waste and fight hunger</p>
        
        <div className="process-flow">
          {/* Step 1 */}
          <div className="process-step">
            <div className="step-icon">🍽️</div>
            <div className="step-number">1</div>
            <h3>Giver Lists Food</h3>
            <p>Hotels, restaurants, or individuals with surplus food add listings with location and availability</p>
          </div>

          {/* Arrow */}
          <div className="process-arrow">→</div>

          {/* Step 2 */}
          <div className="process-step">
            <div className="step-icon">📍</div>
            <div className="step-number">2</div>
            <h3>Food Gets Located</h3>
            <p>Our map system pinpoints food locations making it easy to find nearby options</p>
          </div>

          {/* Arrow */}
          <div className="process-arrow">→</div>

          {/* Step 3 */}
          <div className="process-step">
            <div className="step-icon">🔍</div>
            <div className="step-number">3</div>
            <h3>Receiver Finds Food</h3>
            <p>People in need browse available food, filter by distance, and view details</p>
          </div>

          {/* Arrow */}
          <div className="process-arrow">→</div>

          {/* Step 4 */}
          <div className="process-step">
            <div className="step-icon">🤝</div>
            <div className="step-number">4</div>
            <h3>Food Gets Collected</h3>
            <p>Receiver picks up the food, giver marks it as collected - no waste!</p>
          </div>
        </div>

        {/* Flow Diagram */}
        <div className="flow-diagram">
          <div className="diagram-container">
            <div className="diagram-row">
              <div className="diagram-box giver-box">
                <span className="box-icon">👨‍🍳</span>
                <span className="box-title">Food Giver</span>
                <span className="box-desc">Hotels, Restaurants, Events</span>
              </div>
              
              <div className="diagram-connector">
                <div className="connector-line"></div>
                <span className="connector-label">Adds Listing</span>
              </div>
              
              <div className="diagram-box platform-box">
                <span className="box-icon">🌐</span>
                <span className="box-title">Food Finder</span>
                <span className="box-desc">Platform with Map</span>
              </div>
              
              <div className="diagram-connector">
                <div className="connector-line"></div>
                <span className="connector-label">Shows Location</span>
              </div>
              
              <div className="diagram-box receiver-box">
                <span className="box-icon">👥</span>
                <span className="box-title">Food Receiver</span>
                <span className="box-desc">People in Need</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>Why Choose Food Finder?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Real-time Map</h3>
            <p>See all available food on an interactive map with exact locations</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Time-Sensitive</h3>
            <p>Food items show expiry times so nothing goes to waste</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Easy to Use</h3>
            <p>Simple interface for both givers and receivers</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💚</div>
            <h3>Free & Paid Options</h3>
            <p>Find free food or affordable meals near you</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-item">
          <span className="stat-number">🍲</span>
          <h3>Reduce Waste</h3>
          <p>Save perfectly good food from being thrown away</p>
        </div>
        <div className="stat-item">
          <span className="stat-number">❤️</span>
          <h3>Help Others</h3>
          <p>Connect surplus food with people who need it</p>
        </div>
        <div className="stat-item">
          <span className="stat-number">🌍</span>
          <h3>Save Environment</h3>
          <p>Less food waste means lower carbon footprint</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
