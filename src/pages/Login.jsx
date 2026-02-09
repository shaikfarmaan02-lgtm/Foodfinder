import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");

  // Get registered users from localStorage
  const getRegisteredUsers = () => {
    const saved = localStorage.getItem("registeredUsers");
    return saved ? JSON.parse(saved) : [];
  };

  // Find user by email/name and role
  const findUser = (identifier, role) => {
    const users = getRegisteredUsers();
    return users.find(
      (u) =>
        u.role === role &&
        (u.email?.toLowerCase() === identifier.toLowerCase() ||
          u.name?.toLowerCase() === identifier.toLowerCase())
    );
  };

  const handleLogin = () => {
    if (!selectedRole) {
      alert("Please select a role");
      return;
    }

    // Admin login - no approval needed
    if (selectedRole === "admin") {
      if (!email) {
        alert("Please enter admin email");
        return;
      }
      localStorage.setItem("role", "admin");
      localStorage.setItem("adminEmail", email);
      localStorage.setItem("approvalStatus", "APPROVED");
      alert("Logged in as Admin");
      window.dispatchEvent(new Event("storage"));
      navigate("/admin");
      return;
    }

    // Analyst login - no approval needed (read-only access)
    if (selectedRole === "analyst") {
      if (!name || !email) {
        alert("Please enter name and email");
        return;
      }
      localStorage.setItem("role", "analyst");
      localStorage.setItem("analystName", name);
      localStorage.setItem("analystEmail", email);
      localStorage.setItem("approvalStatus", "APPROVED");
      alert("Logged in as Data Analyst");
      window.dispatchEvent(new Event("storage"));
      navigate("/analytics");
      return;
    }

    // Donor login
    if (selectedRole === "giver") {
      if (!name || !phone) {
        alert("Please enter name and phone number");
        return;
      }

      // Check if user exists and their approval status
      const user = findUser(name, "giver");
      
      let approvalStatus = "APPROVED"; // Default for demo/existing users
      
      if (user) {
        approvalStatus = user.approvalStatus || "APPROVED";
      }

      localStorage.setItem("role", "giver");
      localStorage.setItem("giverName", name);
      localStorage.setItem("giverContact", phone);
      localStorage.setItem("giverAddress", user?.address || "");
      localStorage.setItem("approvalStatus", approvalStatus);
      localStorage.setItem("userEmail", user?.email || email);

      window.dispatchEvent(new Event("storage"));

      if (approvalStatus === "PENDING_APPROVAL") {
        navigate("/pending-approval");
      } else {
        alert("Logged in as Food Donor");
        navigate("/donor-dashboard");
      }
      return;
    }

    // Finder (Receiver) login - auto approved but requires name & phone
    if (selectedRole === "finder") {
      if (!name || !phone) {
        alert("Please enter your name and phone number");
        return;
      }
      localStorage.setItem("role", "finder");
      localStorage.setItem("approvalStatus", "APPROVED");
      localStorage.setItem("finderName", name);
      localStorage.setItem("finderPhone", phone);
      alert("Logged in as Food Finder");
      window.dispatchEvent(new Event("storage"));
      navigate("/find-food");
      return;
    }

    // Organization login
    if (selectedRole === "organization") {
      if (!orgName || !email) {
        alert("Please enter organization name and email");
        return;
      }

      // Check if user exists and their approval status
      const user = findUser(orgName, "organization") || findUser(email, "organization");
      
      let approvalStatus = "APPROVED"; // Default for demo/existing users
      
      if (user) {
        approvalStatus = user.approvalStatus || "APPROVED";
      }

      localStorage.setItem("role", "organization");
      localStorage.setItem("orgName", orgName);
      localStorage.setItem("orgEmail", email);
      localStorage.setItem("approvalStatus", approvalStatus);

      window.dispatchEvent(new Event("storage"));

      if (approvalStatus === "PENDING_APPROVAL") {
        navigate("/pending-approval");
      } else {
        alert("Logged in as Recipient Organization");
        navigate("/organization-dashboard");
      }
      return;
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Welcome to Food Finder</h2>
        <p>Select your role to continue</p>

        <div className="role-buttons">
          <button
            className={`role-btn ${selectedRole === "giver" ? "active" : ""}`}
            onClick={() => setSelectedRole("giver")}
          >
            <span className="role-icon">👨‍🍳</span>
            <span className="role-title">Food Donor</span>
            <span className="role-desc">Share surplus food</span>
          </button>
          <button
            className={`role-btn ${selectedRole === "finder" ? "active" : ""}`}
            onClick={() => setSelectedRole("finder")}
          >
            <span className="role-icon">🔍</span>
            <span className="role-title">Receiver</span>
            <span className="role-desc">Find available food</span>
          </button>
          <button
            className={`role-btn ${selectedRole === "organization" ? "active" : ""}`}
            onClick={() => setSelectedRole("organization")}
          >
            <span className="role-icon">🏢</span>
            <span className="role-title">Organization</span>
            <span className="role-desc">NGOs, Shelters, Hostels</span>
          </button>
          <button
            className={`role-btn ${selectedRole === "analyst" ? "active" : ""}`}
            onClick={() => setSelectedRole("analyst")}
          >
            <span className="role-icon">📊</span>
            <span className="role-title">Data Analyst</span>
            <span className="role-desc">Track trends & insights</span>
          </button>
          <button
            className={`role-btn ${selectedRole === "admin" ? "active" : ""}`}
            onClick={() => setSelectedRole("admin")}
          >
            <span className="role-icon">🛡️</span>
            <span className="role-title">Admin</span>
            <span className="role-desc">Manage platform</span>
          </button>
        </div>

        {/* Giver Form */}
        {selectedRole === "giver" && (
          <div className="auth-form">
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Receiver (Finder) Form */}
        {selectedRole === "finder" && (
          <div className="auth-form">
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="info-box success">
              ✅ No approval needed! You can find food immediately after login.
            </div>
          </div>
        )}

        {/* Organization Form */}
        {selectedRole === "organization" && (
          <div className="auth-form">
            <div className="form-group">
              <label>Organization Name</label>
              <input
                type="text"
                placeholder="Enter organization name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Analyst Form */}
        {selectedRole === "analyst" && (
          <div className="auth-form">
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Admin Form */}
        {selectedRole === "admin" && (
          <div className="auth-form">
            <div className="form-group">
              <label>Admin Email</label>
              <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        <button className="login-btn" onClick={handleLogin}>
          Login as {selectedRole ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) : "..."}
        </button>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
