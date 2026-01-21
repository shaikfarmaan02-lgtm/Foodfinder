import { useParams, Link } from "react-router-dom";
import "../styles/foodDetails.css";

function FoodDetails() {
  const { id } = useParams();

  const foodList =
    JSON.parse(localStorage.getItem("foodList")) || [];

  // Compare as strings since IDs can be string format (e.g., "1234567890-abc123def")
  const food = foodList.find(
    (item) => String(item.id) === String(id)
  );

  if (!food) {
    return (
      <div className="food-details-page">
        <div className="food-details-container">
          <h2>🍽️ Food Not Found</h2>
          <p style={{ color: "#6b7280", marginBottom: "20px" }}>
            This food item may have been removed, collected, or expired.
          </p>
          <Link to="/find-food">
            <button className="back-btn">← Back to Food List</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="food-details-page">
      <div className="food-details-container">
        <h2>{food.foodName}</h2>

        <p>
          <strong>Location:</strong> {food.location}
        </p>

        <p>
          <strong>Price:</strong> {food.price}
        </p>

        <p>
          <strong>Available Till:</strong>{" "}
          {new Date(food.expiryTime).toLocaleString()}
        </p>

        <h3>Giver Details</h3>

        <p>
          <strong>Name:</strong>{" "}
          {food.giverName || "Not provided"}
        </p>

        <p>
          <strong>Contact:</strong>{" "}
          {food.giverContact || "Not provided"}
        </p>

        {food.giverContact && (
          <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
            <a href={`tel:${food.giverContact}`}>
              <button className="back-btn">📞 Call</button>
            </a>
            <a
              href={`https://wa.me/91${food.giverContact}`}
              target="_blank"
              rel="noreferrer"
            >
              <button className="back-btn" style={{ background: "#25d366" }}>💬 WhatsApp</button>
            </a>
          </div>
        )}

        <Link to="/find-food">
          <button className="back-btn" style={{ marginTop: "25px" }}>← Back to Food List</button>
        </Link>
      </div>
    </div>
  );
}

export default FoodDetails;
