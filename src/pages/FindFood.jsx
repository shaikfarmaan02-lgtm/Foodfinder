import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/findFood.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import { Link } from "react-router-dom";

/* ===== FIX LEAFLET ICON ISSUE ===== */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ===== EXPIRY CHECK ===== */
function isNotExpired(expiryTime) {
  return new Date(expiryTime) > new Date();
}

/* ===== DISTANCE CALCULATION (HAVERSINE) ===== */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function FindFood({ foodList, markAsCollected }) {
  const [userLocation, setUserLocation] = useState(null);
  const [maxDistance, setMaxDistance] = useState("all");
  const [sortBy, setSortBy] = useState("nearest"); // "nearest" or "expiring"

  const role = localStorage.getItem("role");
  const approvalStatus = localStorage.getItem("approvalStatus");
  
  // Check if user can perform actions
  const isApprovedDonor = role === "giver" && approvalStatus === "APPROVED";
  const isAdmin = role === "admin";

  /* ===== GET USER LOCATION ===== */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => alert("Location permission denied")
    );
  }, []);

  /* ===== FILTER + DISTANCE ===== */
  const foodsWithDistance =
    userLocation
      ? foodList
          .filter(
            (food) =>
              (food.status === "available" ||
                food.status === undefined) &&
              isNotExpired(food.expiryTime)
          )
          .map((food) => ({
            ...food,
            distance: getDistance(
              userLocation[0],
              userLocation[1],
              food.lat,
              food.lng
            ),
          }))
      : [];

  /* ===== SORT BY SELECTED OPTION ===== */
  const sortedFoods = [...foodsWithDistance].sort((a, b) => {
    if (sortBy === "nearest") {
      return a.distance - b.distance;
    } else {
      // Sort by soonest expiring
      return new Date(a.expiryTime) - new Date(b.expiryTime);
    }
  });

  /* ===== DISTANCE FILTER ===== */
  const filteredFoods =
    maxDistance === "all"
      ? sortedFoods
      : sortedFoods.filter(
          (food) => food.distance <= Number(maxDistance)
        );

  return (
    <div className="find-food-page">
      <div className="find-food-container">
        <h2>Food Near You</h2>
        <p>Discover available food in your area</p>

        {/* ===== FILTERS ROW ===== */}
        <div className="filters-row">
          {/* Distance Filter */}
          <select
            value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Distances</option>
            <option value="2">Within 2 km</option>
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
          </select>

          {/* Sort Toggle */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="nearest">Nearest First</option>
            <option value="expiring">Soonest Expiring</option>
          </select>
        </div>

      {/* ===== MAP ===== */}
      {userLocation && (
        <MapContainer
          center={userLocation}
          zoom={13}
          style={{ height: "300px", margin: "20px 0" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>

          {filteredFoods.map((food) => (
            <Marker key={food.id} position={[food.lat, food.lng]}>
              <Popup>
                <strong>{food.foodName}</strong>
                <br />
                {food.price}
                <br />
                📏 {food.distance.toFixed(2)} km
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {/* ===== FOOD LIST ===== */}
      <div className="food-list">
        {filteredFoods.length === 0 ? (
          <p>No food available in this range.</p>
        ) : (
          filteredFoods.map((food) => (
            <div className="food-card" key={food.id}>
              <div className="food-card-header">
                <h3>{food.foodName}</h3>
              </div>
              <div className="food-card-body">
                <p className="location">📍 {food.location}</p>
                <p><span className="price">{food.price}</span></p>
                <p>🕐 Till {new Date(food.expiryTime).toLocaleString()}</p>
                <p className="distance">📏 {food.distance.toFixed(2)} km away</p>
              </div>
              <div className="food-card-footer">
                <Link to={`/food/${food.id}`} className="details-link">
                  View Details
                </Link>

                {/* Only approved donors or admins can mark as collected */}
                {(isApprovedDonor || isAdmin) && (
                  <button
                    className="collect-btn"
                    onClick={() => markAsCollected(food.id)}
                  >
                    Mark Collected
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
}

export default FindFood;
