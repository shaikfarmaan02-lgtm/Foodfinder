import { useState, useEffect } from "react";
import "../styles/donorDashboard.css";

function DonorDashboard({ foodList }) {
  const giverName = localStorage.getItem("giverName");
  const role = localStorage.getItem("role");
  const approvalStatus = localStorage.getItem("approvalStatus");

  // Check if user is approved
  if (role !== "giver" && role !== "admin") {
    return (
      <div className="unauthorized-message">
        <h2>⚠️ Access Denied - Donors Only</h2>
      </div>
    );
  }

  if (approvalStatus === "PENDING_APPROVAL") {
    return (
      <div className="unauthorized-message">
        <h2>⏳ Account Pending Approval</h2>
        <p>Your donor account is awaiting admin approval.</p>
      </div>
    );
  }

  // Filter donations by current donor
  const myDonations = foodList.filter(food => food.giverName === giverName);

  // Calculate stats
  const totalDonations = myDonations.length;
  const collectedDonations = myDonations.filter(f => f.status === "collected").length;
  const activeDonations = myDonations.filter(f => f.status === "available" && new Date(f.expiryTime) > new Date()).length;
  const expiredDonations = myDonations.filter(f => new Date(f.expiryTime) < new Date() && f.status !== "collected").length;
  
  // Estimate meals (1 donation = ~10 meals average)
  const mealsProvided = collectedDonations * 10;
  const foodWasted = expiredDonations;
  const utilizationRate = totalDonations > 0 
    ? Math.round((collectedDonations / totalDonations) * 100) 
    : 0;

  // Monthly stats (mock data for demonstration)
  const monthlyStats = [
    { month: "Oct 2025", donated: 5, collected: 4, wasted: 1 },
    { month: "Nov 2025", donated: 8, collected: 7, wasted: 1 },
    { month: "Dec 2025", donated: 12, collected: 10, wasted: 2 },
    { month: "Jan 2026", donated: totalDonations, collected: collectedDonations, wasted: expiredDonations },
  ];

  return (
    <div className="donor-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>👨‍🍳 Donor Impact Dashboard</h1>
          <p>Track your contribution to reducing food waste</p>
        </div>
        <div className="donor-info">
          <span className="donor-name">{giverName}</span>
          <span className="donor-badge">Verified Donor</span>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="impact-section">
        <h2>🌟 Your Impact Summary</h2>
        <div className="impact-grid">
          <div className="impact-card meals">
            <div className="impact-icon">🍽️</div>
            <div className="impact-value">{mealsProvided}</div>
            <div className="impact-label">Meals Provided</div>
            <div className="impact-desc">Estimated meals from collected food</div>
          </div>
          <div className="impact-card rate">
            <div className="impact-icon">📊</div>
            <div className="impact-value">{utilizationRate}%</div>
            <div className="impact-label">Utilization Rate</div>
            <div className="impact-desc">Food successfully collected</div>
          </div>
          <div className="impact-card saved">
            <div className="impact-icon">🌍</div>
            <div className="impact-value">{collectedDonations * 2.5}kg</div>
            <div className="impact-label">CO₂ Saved</div>
            <div className="impact-desc">Environmental impact</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-section">
        <h2>📈 Donation Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card total">
            <span className="stat-number">{totalDonations}</span>
            <span className="stat-label">Total Donations</span>
          </div>
          <div className="stat-card active">
            <span className="stat-number">{activeDonations}</span>
            <span className="stat-label">Active Listings</span>
          </div>
          <div className="stat-card collected">
            <span className="stat-number">{collectedDonations}</span>
            <span className="stat-label">Food Collected</span>
          </div>
          <div className="stat-card wasted">
            <span className="stat-number">{expiredDonations}</span>
            <span className="stat-label">Expired/Wasted</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <h2>🎯 Collection Progress</h2>
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill collected-fill" 
              style={{ width: `${(collectedDonations / Math.max(totalDonations, 1)) * 100}%` }}
            ></div>
            <div 
              className="progress-fill wasted-fill" 
              style={{ width: `${(expiredDonations / Math.max(totalDonations, 1)) * 100}%` }}
            ></div>
          </div>
          <div className="progress-legend">
            <span className="legend-item"><span className="dot green"></span> Collected ({collectedDonations})</span>
            <span className="legend-item"><span className="dot red"></span> Wasted ({expiredDonations})</span>
            <span className="legend-item"><span className="dot blue"></span> Active ({activeDonations})</span>
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart (Visual) */}
      <div className="chart-section">
        <h2>📅 Monthly Donation Trend</h2>
        <div className="chart-container">
          {monthlyStats.map((stat, index) => (
            <div className="chart-bar-group" key={index}>
              <div className="bars">
                <div 
                  className="bar donated" 
                  style={{ height: `${stat.donated * 8}px` }}
                  title={`Donated: ${stat.donated}`}
                ></div>
                <div 
                  className="bar collected" 
                  style={{ height: `${stat.collected * 8}px` }}
                  title={`Collected: ${stat.collected}`}
                ></div>
                <div 
                  className="bar wasted" 
                  style={{ height: `${stat.wasted * 8}px` }}
                  title={`Wasted: ${stat.wasted}`}
                ></div>
              </div>
              <span className="chart-label">{stat.month}</span>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <span><span className="dot blue"></span> Donated</span>
          <span><span className="dot green"></span> Collected</span>
          <span><span className="dot red"></span> Wasted</span>
        </div>
      </div>

      {/* Donation History */}
      <div className="history-section">
        <h2>📋 Donation History</h2>
        <div className="history-table">
          <table>
            <thead>
              <tr>
                <th>Food Item</th>
                <th>Location</th>
                <th>Price</th>
                <th>Expiry</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myDonations.length === 0 ? (
                <tr><td colSpan="5" className="no-data">No donations yet. Start by adding food!</td></tr>
              ) : (
                myDonations.map((food) => (
                  <tr key={food.id}>
                    <td>{food.foodName}</td>
                    <td>{food.location}</td>
                    <td>{food.price}</td>
                    <td>{new Date(food.expiryTime).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${
                        new Date(food.expiryTime) < new Date() && food.status !== "collected" 
                          ? "expired" 
                          : food.status
                      }`}>
                        {new Date(food.expiryTime) < new Date() && food.status !== "collected" 
                          ? "Expired" 
                          : food.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips Section */}
      <div className="tips-section">
        <h2>💡 Tips to Improve Your Impact</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">⏰</span>
            <h4>Set Realistic Expiry Times</h4>
            <p>Give recipients enough time to collect food</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">📍</span>
            <h4>Accurate Location</h4>
            <p>Help recipients find you easily</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">📸</span>
            <h4>Add Details</h4>
            <p>Include food type and quantity for better matching</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorDashboard;
