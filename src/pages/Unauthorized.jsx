import { useNavigate } from "react-router-dom";
import "../styles/statusPages.css";

function Unauthorized() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const getRoleDashboard = () => {
    switch (role) {
      case "giver":
        return "/donor-dashboard";
      case "organization":
        return "/organization-dashboard";
      case "analyst":
        return "/analytics";
      case "admin":
        return "/admin";
      case "finder":
        return "/find-food";
      default:
        return "/";
    }
  };

  return (
    <div className="status-page unauthorized">
      <div className="status-container">
        <div className="status-icon">🚫</div>
        <h1>Access Denied</h1>
        <p className="status-message">
          You don't have permission to access this page. This area is restricted based on user roles.
        </p>

        <div className="status-details">
          <div className="detail-item">
            <span className="detail-label">Your Role:</span>
            <span className="detail-value role-badge">{role || "Not logged in"}</span>
          </div>
        </div>

        <div className="status-info">
          <h3>What can you do?</h3>
          <ul>
            {role === "giver" && (
              <>
                <li>Add and manage food donations</li>
                <li>View your donor dashboard</li>
                <li>Track your impact</li>
              </>
            )}
            {role === "organization" && (
              <>
                <li>Browse available food</li>
                <li>Request food donations</li>
                <li>Track distribution</li>
              </>
            )}
            {role === "finder" && (
              <>
                <li>Find available food near you</li>
                <li>View food details</li>
              </>
            )}
            {role === "analyst" && (
              <>
                <li>View analytics dashboard</li>
                <li>Track trends and insights</li>
              </>
            )}
            {role === "admin" && (
              <>
                <li>Full platform access</li>
                <li>Manage users and listings</li>
              </>
            )}
            {!role && (
              <li>Please login to access features</li>
            )}
          </ul>
        </div>

        <div className="status-actions">
          <button className="btn-secondary" onClick={() => navigate("/")}>
            🏠 Go to Home
          </button>
          {role ? (
            <button className="btn-primary" onClick={() => navigate(getRoleDashboard())}>
              📊 Go to Your Dashboard
            </button>
          ) : (
            <button className="btn-primary" onClick={() => navigate("/login")}>
              🔐 Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
