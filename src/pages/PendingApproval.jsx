import { useNavigate } from "react-router-dom";
import "../styles/statusPages.css";

function PendingApproval() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("giverName") || 
                   localStorage.getItem("orgName") || 
                   localStorage.getItem("analystName") || 
                   "User";

  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.removeItem("role");
    localStorage.removeItem("approvalStatus");
    localStorage.removeItem("giverName");
    localStorage.removeItem("giverContact");
    localStorage.removeItem("orgName");
    localStorage.removeItem("orgEmail");
    localStorage.removeItem("analystName");
    localStorage.removeItem("analystEmail");
    localStorage.removeItem("userEmail");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  return (
    <div className="status-page pending">
      <div className="status-container">
        <div className="status-icon">⏳</div>
        <h1>Account Pending Approval</h1>
        <p className="status-message">
          Your account is pending admin approval. Please wait while we review your registration.
        </p>
        
        <div className="status-details">
          <div className="detail-item">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{userName}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Role:</span>
            <span className="detail-value role-badge">{role}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Status:</span>
            <span className="detail-value status-badge pending">Pending Approval</span>
          </div>
        </div>

        <div className="status-info">
          <h3>What happens next?</h3>
          <ul>
            <li>An admin will review your registration</li>
            <li>You'll receive approval within 24-48 hours</li>
            <li>Once approved, you can access all features</li>
          </ul>
        </div>

        <div className="status-actions">
          <button className="btn-secondary" onClick={() => navigate("/")}>
            🏠 Go to Home
          </button>
          <button className="btn-primary" onClick={handleLogout}>
            🔄 Login with Different Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default PendingApproval;
