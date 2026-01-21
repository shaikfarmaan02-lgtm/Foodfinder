import { useState, useEffect } from "react";
import "../styles/organizationDashboard.css";

function OrganizationDashboard({ foodList, setFoodList }) {
  const orgName = localStorage.getItem("orgName") || "Organization";
  const role = localStorage.getItem("role");
  const approvalStatus = localStorage.getItem("approvalStatus");

  // Check authorization first
  if (role !== "organization" && role !== "admin") {
    return (
      <div className="unauthorized-message">
        <h2>⚠️ Access Denied - Organizations Only</h2>
      </div>
    );
  }

  if (approvalStatus === "PENDING_APPROVAL") {
    return (
      <div className="unauthorized-message">
        <h2>⏳ Account Pending Approval</h2>
        <p>Your organization account is awaiting admin verification.</p>
      </div>
    );
  }

  // Food requests state
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem("foodRequests");
    return saved ? JSON.parse(saved) : [];
  });

  // Distribution records
  const [distributions, setDistributions] = useState(() => {
    const saved = localStorage.getItem("distributions");
    return saved ? JSON.parse(saved) : [
      { id: 1, foodName: "Rice & Curry", receivedDate: "2026-01-15", quantity: "50 meals", beneficiaries: 50, status: "distributed" },
      { id: 2, foodName: "Bread & Vegetables", receivedDate: "2026-01-17", quantity: "30 meals", beneficiaries: 30, status: "distributed" },
    ];
  });

  const [activeTab, setActiveTab] = useState("available");

  useEffect(() => {
    localStorage.setItem("foodRequests", JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem("distributions", JSON.stringify(distributions));
  }, [distributions]);

  // Available food (not yet requested or collected)
  const availableFood = foodList.filter(
    food => food.status === "available" && 
    new Date(food.expiryTime) > new Date() &&
    !requests.some(r => r.foodId === food.id && r.status !== "rejected")
  );

  // My requests
  const myRequests = requests.filter(r => r.orgName === orgName);
  const pendingRequests = myRequests.filter(r => r.status === "pending");
  const acceptedRequests = myRequests.filter(r => r.status === "accepted");
  const collectedRequests = myRequests.filter(r => r.status === "collected");

  // Stats
  const totalReceived = distributions.length;
  const totalBeneficiaries = distributions.reduce((sum, d) => sum + d.beneficiaries, 0);

  // Request food
  const requestFood = (food) => {
    const newRequest = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      foodId: food.id,
      foodName: food.foodName,
      location: food.location,
      giverName: food.giverName,
      giverContact: food.giverContact,
      orgName: orgName,
      requestDate: new Date().toISOString(),
      status: "pending",
      expiryTime: food.expiryTime,
    };
    setRequests(prev => [...prev, newRequest]);
    alert(`Request sent for ${food.foodName}!`);
  };

  // Mark as collected
  const markCollected = (requestId, foodId) => {
    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: "collected" } : r
    ));
    
    // Update food list
    setFoodList(prev => prev.map(f => 
      f.id === foodId ? { ...f, status: "collected" } : f
    ));

    // Add to distributions
    const request = requests.find(r => r.id === requestId);
    if (request) {
      const newDistribution = {
        id: Date.now(),
        foodName: request.foodName,
        receivedDate: new Date().toISOString().split('T')[0],
        quantity: "Estimated meals",
        beneficiaries: Math.floor(Math.random() * 30) + 10,
        status: "received",
      };
      setDistributions(prev => [...prev, newDistribution]);
    }
    
    alert("Food marked as collected!");
  };

  // Mark distribution complete
  const markDistributed = (distId) => {
    setDistributions(prev => prev.map(d => 
      d.id === distId ? { ...d, status: "distributed" } : d
    ));
  };

  // For demo: Accept request (simulating donor acceptance)
  const simulateAcceptRequest = (requestId) => {
    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: "accepted" } : r
    ));
    alert("Request accepted by donor!");
  };

  return (
    <div className="org-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🏢 Organization Dashboard</h1>
          <p>Manage food requests and distribution</p>
        </div>
        <div className="org-info">
          <span className="org-name">{orgName}</span>
          <span className="org-badge">Verified Organization</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card pending">
          <span className="stat-icon">⏳</span>
          <div className="stat-content">
            <span className="stat-value">{pendingRequests.length}</span>
            <span className="stat-label">Pending Requests</span>
          </div>
        </div>
        <div className="stat-card accepted">
          <span className="stat-icon">✅</span>
          <div className="stat-content">
            <span className="stat-value">{acceptedRequests.length}</span>
            <span className="stat-label">Ready to Collect</span>
          </div>
        </div>
        <div className="stat-card collected">
          <span className="stat-icon">📦</span>
          <div className="stat-content">
            <span className="stat-value">{totalReceived}</span>
            <span className="stat-label">Total Received</span>
          </div>
        </div>
        <div className="stat-card beneficiaries">
          <span className="stat-icon">👥</span>
          <div className="stat-content">
            <span className="stat-value">{totalBeneficiaries}</span>
            <span className="stat-label">People Served</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="org-tabs">
        <button 
          className={activeTab === "available" ? "active" : ""} 
          onClick={() => setActiveTab("available")}
        >
          🍽️ Available Food ({availableFood.length})
        </button>
        <button 
          className={activeTab === "requests" ? "active" : ""} 
          onClick={() => setActiveTab("requests")}
        >
          📋 My Requests ({myRequests.length})
        </button>
        <button 
          className={activeTab === "distribution" ? "active" : ""} 
          onClick={() => setActiveTab("distribution")}
        >
          📊 Distribution Tracking
        </button>
      </div>

      {/* Available Food Tab */}
      {activeTab === "available" && (
        <div className="tab-content">
          <h3>Available Food for Request</h3>
          {availableFood.length === 0 ? (
            <p className="no-data">No food available at the moment. Check back later!</p>
          ) : (
            <div className="food-grid">
              {availableFood.map(food => (
                <div className="food-request-card" key={food.id}>
                  <div className="card-header">
                    <h4>{food.foodName}</h4>
                    <span className="price-tag">{food.price}</span>
                  </div>
                  <div className="card-body">
                    <p><span className="icon">📍</span> {food.location}</p>
                    <p><span className="icon">👨‍🍳</span> {food.giverName}</p>
                    <p><span className="icon">⏰</span> Expires: {new Date(food.expiryTime).toLocaleString()}</p>
                  </div>
                  <div className="card-footer">
                    <button className="request-btn" onClick={() => requestFood(food)}>
                      📩 Request This Food
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Requests Tab */}
      {activeTab === "requests" && (
        <div className="tab-content">
          <h3>My Food Requests</h3>
          
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div className="request-section">
              <h4>⏳ Pending Requests</h4>
              <div className="requests-list">
                {pendingRequests.map(request => (
                  <div className="request-card pending" key={request.id}>
                    <div className="request-info">
                      <h5>{request.foodName}</h5>
                      <p>📍 {request.location}</p>
                      <p>👨‍🍳 Donor: {request.giverName}</p>
                      <p>📅 Requested: {new Date(request.requestDate).toLocaleDateString()}</p>
                    </div>
                    <div className="request-status">
                      <span className="status-badge pending">Pending</span>
                      {/* Demo button to simulate acceptance */}
                      <button 
                        className="demo-btn"
                        onClick={() => simulateAcceptRequest(request.id)}
                      >
                        (Demo: Accept)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Accepted Requests */}
          {acceptedRequests.length > 0 && (
            <div className="request-section">
              <h4>✅ Ready to Collect</h4>
              <div className="requests-list">
                {acceptedRequests.map(request => (
                  <div className="request-card accepted" key={request.id}>
                    <div className="request-info">
                      <h5>{request.foodName}</h5>
                      <p>📍 {request.location}</p>
                      <p>📞 Contact: {request.giverContact}</p>
                      <p>⏰ Collect before: {new Date(request.expiryTime).toLocaleString()}</p>
                    </div>
                    <div className="request-actions">
                      <button 
                        className="collect-btn"
                        onClick={() => markCollected(request.id, request.foodId)}
                      >
                        ✅ Mark as Collected
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collected */}
          {collectedRequests.length > 0 && (
            <div className="request-section">
              <h4>📦 Collected</h4>
              <div className="requests-list">
                {collectedRequests.map(request => (
                  <div className="request-card collected" key={request.id}>
                    <div className="request-info">
                      <h5>{request.foodName}</h5>
                      <p>📍 {request.location}</p>
                      <p>👨‍🍳 From: {request.giverName}</p>
                    </div>
                    <span className="status-badge collected">Collected ✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {myRequests.length === 0 && (
            <p className="no-data">No requests yet. Browse available food to make requests!</p>
          )}
        </div>
      )}

      {/* Distribution Tracking Tab */}
      {activeTab === "distribution" && (
        <div className="tab-content">
          <h3>Distribution Tracking</h3>
          
          <div className="distribution-summary">
            <div className="summary-card">
              <span className="summary-icon">📦</span>
              <div>
                <h4>{distributions.filter(d => d.status === "received").length}</h4>
                <p>Pending Distribution</p>
              </div>
            </div>
            <div className="summary-card">
              <span className="summary-icon">✅</span>
              <div>
                <h4>{distributions.filter(d => d.status === "distributed").length}</h4>
                <p>Distributed</p>
              </div>
            </div>
            <div className="summary-card">
              <span className="summary-icon">👥</span>
              <div>
                <h4>{totalBeneficiaries}</h4>
                <p>Total Beneficiaries</p>
              </div>
            </div>
          </div>

          <div className="distribution-table">
            <table>
              <thead>
                <tr>
                  <th>Food Item</th>
                  <th>Received Date</th>
                  <th>Quantity</th>
                  <th>Beneficiaries</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {distributions.map(dist => (
                  <tr key={dist.id}>
                    <td>{dist.foodName}</td>
                    <td>{dist.receivedDate}</td>
                    <td>{dist.quantity}</td>
                    <td>{dist.beneficiaries}</td>
                    <td>
                      <span className={`status-badge ${dist.status}`}>
                        {dist.status}
                      </span>
                    </td>
                    <td>
                      {dist.status === "received" && (
                        <button 
                          className="distribute-btn"
                          onClick={() => markDistributed(dist.id)}
                        >
                          Mark Distributed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganizationDashboard;
