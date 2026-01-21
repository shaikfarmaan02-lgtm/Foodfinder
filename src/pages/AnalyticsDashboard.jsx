import { useState, useMemo } from "react";
import "../styles/analyticsDashboard.css";

function AnalyticsDashboard({ foodList }) {
  const [dateRange, setDateRange] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const role = localStorage.getItem("role");

  // Calculate analytics
  const analytics = useMemo(() => {
    const now = new Date();
    
    // Filter by date range
    let filteredList = [...foodList];
    if (dateRange === "week") {
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      filteredList = foodList.filter(f => new Date(f.expiryTime) > weekAgo);
    } else if (dateRange === "month") {
      const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
      filteredList = foodList.filter(f => new Date(f.expiryTime) > monthAgo);
    }

    // Filter by location
    if (selectedLocation !== "all") {
      filteredList = filteredList.filter(f => f.location === selectedLocation);
    }

    const totalListed = filteredList.length;
    const collected = filteredList.filter(f => f.status === "collected").length;
    const expired = filteredList.filter(f => 
      new Date(f.expiryTime) < now && f.status !== "collected"
    ).length;
    const active = filteredList.filter(f => 
      f.status === "available" && new Date(f.expiryTime) > now
    ).length;

    const utilizationRate = totalListed > 0 
      ? Math.round((collected / totalListed) * 100) 
      : 0;
    const wasteRate = totalListed > 0 
      ? Math.round((expired / totalListed) * 100) 
      : 0;

    // Location-wise breakdown
    const locationStats = {};
    filteredList.forEach(food => {
      if (!locationStats[food.location]) {
        locationStats[food.location] = { total: 0, collected: 0, expired: 0 };
      }
      locationStats[food.location].total++;
      if (food.status === "collected") {
        locationStats[food.location].collected++;
      } else if (new Date(food.expiryTime) < now) {
        locationStats[food.location].expired++;
      }
    });

    // Donor-wise breakdown
    const donorStats = {};
    filteredList.forEach(food => {
      const donor = food.giverName || "Unknown";
      if (!donorStats[donor]) {
        donorStats[donor] = { total: 0, collected: 0, expired: 0 };
      }
      donorStats[donor].total++;
      if (food.status === "collected") {
        donorStats[donor].collected++;
      } else if (new Date(food.expiryTime) < now) {
        donorStats[donor].expired++;
      }
    });

    // Food type breakdown
    const typeStats = { free: 0, paid: 0 };
    filteredList.forEach(food => {
      if (food.price === "Free" || food.type === "free") {
        typeStats.free++;
      } else {
        typeStats.paid++;
      }
    });

    return {
      totalListed,
      collected,
      expired,
      active,
      utilizationRate,
      wasteRate,
      locationStats,
      donorStats,
      typeStats,
    };
  }, [foodList, dateRange, selectedLocation]);

  // Get unique locations
  const locations = [...new Set(foodList.map(f => f.location))];

  // Mock trend data for charts
  const trendData = [
    { period: "Week 1", listed: 15, collected: 12, expired: 3 },
    { period: "Week 2", listed: 22, collected: 18, expired: 4 },
    { period: "Week 3", listed: 28, collected: 24, expired: 4 },
    { period: "Week 4", listed: foodList.length || 35, collected: analytics.collected || 28, expired: analytics.expired || 7 },
  ];

  // Recommendations based on data
  const recommendations = useMemo(() => {
    const recs = [];
    if (analytics.wasteRate > 20) {
      recs.push({
        type: "warning",
        title: "High Waste Rate Detected",
        desc: `${analytics.wasteRate}% of food is expiring. Consider shorter expiry windows or better distribution.`
      });
    }
    if (analytics.utilizationRate < 70) {
      recs.push({
        type: "info",
        title: "Improve Collection Rate",
        desc: "Current collection rate is below optimal. Increase outreach to recipient organizations."
      });
    }
    if (Object.keys(analytics.locationStats).length > 0) {
      const worstLocation = Object.entries(analytics.locationStats)
        .sort((a, b) => (b[1].expired / b[1].total) - (a[1].expired / a[1].total))[0];
      if (worstLocation && worstLocation[1].expired > 0) {
        recs.push({
          type: "alert",
          title: `Focus on ${worstLocation[0]}`,
          desc: `This location has higher waste. ${worstLocation[1].expired} items expired out of ${worstLocation[1].total}.`
        });
      }
    }
    if (recs.length === 0) {
      recs.push({
        type: "success",
        title: "Great Performance!",
        desc: "Food distribution is working efficiently. Keep up the good work!"
      });
    }
    return recs;
  }, [analytics]);

  if (role !== "analyst" && role !== "admin") {
    return (
      <div className="unauthorized-message">
        <h2>⚠️ Access Denied - Analysts & Admins Only</h2>
        <p>This dashboard is restricted to data analysts and administrators.</p>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>📊 Data Analytics Dashboard</h1>
          <p>Track food waste trends and generate insights</p>
        </div>
        <div className="header-filters">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="all">All Time</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
          <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
            <option value="all">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-section">
        <h2>📈 Key Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card total">
            <div className="metric-icon">📋</div>
            <div className="metric-value">{analytics.totalListed}</div>
            <div className="metric-label">Total Food Listed</div>
          </div>
          <div className="metric-card collected">
            <div className="metric-icon">✅</div>
            <div className="metric-value">{analytics.collected}</div>
            <div className="metric-label">Food Collected</div>
          </div>
          <div className="metric-card expired">
            <div className="metric-icon">⏰</div>
            <div className="metric-value">{analytics.expired}</div>
            <div className="metric-label">Food Expired/Wasted</div>
          </div>
          <div className="metric-card active">
            <div className="metric-icon">🟢</div>
            <div className="metric-value">{analytics.active}</div>
            <div className="metric-label">Currently Active</div>
          </div>
        </div>
      </div>

      {/* Efficiency Gauges */}
      <div className="gauges-section">
        <h2>🎯 Efficiency Indicators</h2>
        <div className="gauges-grid">
          <div className="gauge-card">
            <div className="gauge">
              <svg viewBox="0 0 100 50">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray={`${analytics.utilizationRate * 1.26} 126`}
                />
              </svg>
              <div className="gauge-value">{analytics.utilizationRate}%</div>
            </div>
            <div className="gauge-label">Utilization Rate</div>
            <div className="gauge-desc">Food successfully collected</div>
          </div>
          <div className="gauge-card">
            <div className="gauge">
              <svg viewBox="0 0 100 50">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="8"
                  strokeDasharray={`${analytics.wasteRate * 1.26} 126`}
                />
              </svg>
              <div className="gauge-value">{analytics.wasteRate}%</div>
            </div>
            <div className="gauge-label">Waste Rate</div>
            <div className="gauge-desc">Food expired without collection</div>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="chart-section">
        <h2>📅 Weekly Trend Analysis</h2>
        <div className="bar-chart">
          <div className="chart-y-axis">
            <span>40</span>
            <span>30</span>
            <span>20</span>
            <span>10</span>
            <span>0</span>
          </div>
          <div className="chart-bars">
            {trendData.map((data, index) => (
              <div className="bar-group" key={index}>
                <div className="bars-container">
                  <div 
                    className="bar listed" 
                    style={{ height: `${(data.listed / 40) * 100}%` }}
                    title={`Listed: ${data.listed}`}
                  >
                    <span className="bar-value">{data.listed}</span>
                  </div>
                  <div 
                    className="bar collected" 
                    style={{ height: `${(data.collected / 40) * 100}%` }}
                    title={`Collected: ${data.collected}`}
                  >
                    <span className="bar-value">{data.collected}</span>
                  </div>
                  <div 
                    className="bar expired" 
                    style={{ height: `${(data.expired / 40) * 100}%` }}
                    title={`Expired: ${data.expired}`}
                  >
                    <span className="bar-value">{data.expired}</span>
                  </div>
                </div>
                <span className="bar-label">{data.period}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-legend">
          <span><span className="dot blue"></span> Listed</span>
          <span><span className="dot green"></span> Collected</span>
          <span><span className="dot red"></span> Expired</span>
        </div>
      </div>

      {/* Location Analysis */}
      <div className="location-section">
        <h2>📍 Location-wise Analysis</h2>
        <div className="location-table">
          <table>
            <thead>
              <tr>
                <th>Location</th>
                <th>Total Listed</th>
                <th>Collected</th>
                <th>Expired</th>
                <th>Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(analytics.locationStats).length === 0 ? (
                <tr><td colSpan="5" className="no-data">No location data available</td></tr>
              ) : (
                Object.entries(analytics.locationStats).map(([loc, stats]) => (
                  <tr key={loc}>
                    <td>{loc}</td>
                    <td>{stats.total}</td>
                    <td className="collected">{stats.collected}</td>
                    <td className="expired">{stats.expired}</td>
                    <td>
                      <div className="efficiency-bar">
                        <div 
                          className="efficiency-fill"
                          style={{ width: `${(stats.collected / stats.total) * 100}%` }}
                        ></div>
                        <span>{Math.round((stats.collected / stats.total) * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Donor Performance */}
      <div className="donor-section">
        <h2>👨‍🍳 Donor Performance</h2>
        <div className="donor-cards">
          {Object.keys(analytics.donorStats).length === 0 ? (
            <p className="no-data">No donor data available</p>
          ) : (
            Object.entries(analytics.donorStats).slice(0, 6).map(([donor, stats]) => (
              <div className="donor-card" key={donor}>
                <div className="donor-avatar">👨‍🍳</div>
                <h4>{donor}</h4>
                <div className="donor-stats">
                  <span className="stat">📋 {stats.total} listed</span>
                  <span className="stat collected">✅ {stats.collected} collected</span>
                  <span className="stat expired">❌ {stats.expired} expired</span>
                </div>
                <div className="donor-efficiency">
                  {Math.round((stats.collected / stats.total) * 100)}% efficiency
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Food Type Distribution */}
      <div className="type-section">
        <h2>🍽️ Food Type Distribution</h2>
        <div className="type-chart">
          <div className="pie-chart">
            <div 
              className="pie-segment free"
              style={{ 
                background: `conic-gradient(
                  #10b981 0% ${(analytics.typeStats.free / (analytics.typeStats.free + analytics.typeStats.paid || 1)) * 100}%, 
                  #f59e0b ${(analytics.typeStats.free / (analytics.typeStats.free + analytics.typeStats.paid || 1)) * 100}% 100%
                )`
              }}
            ></div>
          </div>
          <div className="type-legend">
            <div className="legend-item">
              <span className="dot green"></span>
              <span>Free Food: {analytics.typeStats.free} ({Math.round((analytics.typeStats.free / (analytics.totalListed || 1)) * 100)}%)</span>
            </div>
            <div className="legend-item">
              <span className="dot yellow"></span>
              <span>Paid Food: {analytics.typeStats.paid} ({Math.round((analytics.typeStats.paid / (analytics.totalListed || 1)) * 100)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="recommendations-section">
        <h2>💡 Insights & Recommendations</h2>
        <div className="recommendations-list">
          {recommendations.map((rec, index) => (
            <div className={`recommendation-card ${rec.type}`} key={index}>
              <div className="rec-icon">
                {rec.type === "warning" && "⚠️"}
                {rec.type === "info" && "ℹ️"}
                {rec.type === "alert" && "🚨"}
                {rec.type === "success" && "✅"}
              </div>
              <div className="rec-content">
                <h4>{rec.title}</h4>
                <p>{rec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="export-section">
        <h2>📤 Export Reports</h2>
        <div className="export-buttons">
          <button className="export-btn" onClick={() => alert("Report generated! (Demo)")}>
            📄 Generate PDF Report
          </button>
          <button className="export-btn" onClick={() => alert("Data exported! (Demo)")}>
            📊 Export to CSV
          </button>
          <button className="export-btn" onClick={() => window.print()}>
            🖨️ Print Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
