import "../styles/profile.css";

function Profile() {
  const role = localStorage.getItem("role");
  const giverName = localStorage.getItem("giverName");
  const giverContact = localStorage.getItem("giverContact");
  const giverAddress = localStorage.getItem("giverAddress");

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>My Profile</h2>
        
        <div className="profile-info">
          <p><strong>Role:</strong> {role || "Not logged in"}</p>
          {role === "giver" && (
            <>
              <p><strong>Name:</strong> {giverName || "Not set"}</p>
              <p><strong>Contact:</strong> {giverContact || "Not set"}</p>
              <p><strong>Address:</strong> {giverAddress || "Not set"}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
