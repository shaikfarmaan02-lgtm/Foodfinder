import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileDropdown from "./ProfileDropdown";
import "../styles/navbar.css";

function Navbar() {
  const [role, setRole] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Read role and approval status AFTER component mounts
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedApproval = localStorage.getItem("approvalStatus");
    setRole(storedRole);
    setApprovalStatus(storedApproval);
    setIsLoaded(true);
  }, []);

  // Listen for storage changes (login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
      setApprovalStatus(localStorage.getItem("approvalStatus"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Check if user is approved (or doesn't need approval)
  const isApproved = approvalStatus === "APPROVED" || role === "admin" || role === "finder";
  const isPending = approvalStatus === "PENDING_APPROVAL";

  // Get display name for role
  const getRoleDisplayName = () => {
    switch (role) {
      case "giver": return "Donor";
      case "organization": return "Organization";
      case "finder": return "Receiver";
      case "analyst": return "Analyst";
      case "admin": return "Admin";
      default: return role;
    }
  };

  if (!isLoaded) return null; // prevent flicker

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">Food Finder</Link>
      </div>

      <div className="nav-center">
        <Link to="/">Home</Link>
        <Link to="/find-food">Find Food</Link>
        
        {/* Food Donor Links - Only show if approved */}
        {role === "giver" && isApproved && (
          <>
            <Link to="/add-food">Add Food</Link>
            <Link to="/my-foods">My Foods</Link>
            <Link to="/donor-dashboard">Dashboard</Link>
          </>
        )}

        {/* Organization Links - Only show if approved */}
        {role === "organization" && isApproved && (
          <Link to="/organization-dashboard">Dashboard</Link>
        )}

        {/* Data Analyst Links */}
        {role === "analyst" && (
          <Link to="/analytics">Analytics</Link>
        )}

        {/* Admin Links */}
        {role === "admin" && (
          <>
            <Link to="/admin">Admin Panel</Link>
            <Link to="/analytics">Analytics</Link>
          </>
        )}

        <Link to="/contact">Contact Us</Link>
        <Link to="/feedback">Feedback</Link>
      </div>

      <div className="nav-right">
        {!role && (
          <>
            <Link to="/login" className="login-link">Login</Link>
            <Link to="/register" className="register-link">Register</Link>
          </>
        )}
        {role && (
          <div className="user-menu">
            <div className="user-badges">
              <span className={`role-indicator ${role}`}>{getRoleDisplayName()}</span>
              {isPending && (
                <span className="status-indicator pending">Pending</span>
              )}
              {isApproved && role !== "finder" && (
                <span className="status-indicator approved">✓</span>
              )}
            </div>
            <ProfileDropdown />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
