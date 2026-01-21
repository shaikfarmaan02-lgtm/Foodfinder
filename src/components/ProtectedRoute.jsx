import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute Component
 * Handles authentication, role-based access, and approval status checking
 * 
 * @param {React.ReactNode} children - The component to render if authorized
 * @param {string[]} allowedRoles - Array of roles that can access this route
 * @param {boolean} requireApproval - Whether the user must be approved (default: true)
 */
function ProtectedRoute({ children, allowedRoles = [], requireApproval = true }) {
  const role = localStorage.getItem("role");
  const approvalStatus = localStorage.getItem("approvalStatus");

  // Not logged in - redirect to login
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Check if role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check approval status (skip for admin and receiver)
  if (requireApproval && role !== "admin" && role !== "finder") {
    if (approvalStatus === "PENDING_APPROVAL") {
      return <Navigate to="/pending-approval" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
