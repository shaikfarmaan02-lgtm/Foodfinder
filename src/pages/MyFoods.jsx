import "../styles/myFoods.css";

function MyFoods({ foodList, deleteFood, markAsCollected }) {
  const giverName = localStorage.getItem("giverName");
  const role = localStorage.getItem("role");
  const approvalStatus = localStorage.getItem("approvalStatus");

  // Check authorization
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
        <p>Your donor account must be approved to view and manage your foods.</p>
      </div>
    );
  }

  const myFoods = foodList.filter(
    (food) => food.giverName === giverName
  );

  return (
    <div className="my-foods-page">
      <div className="my-foods-container">
        <h2>My Foods</h2>
        <p>Manage the food items you have shared</p>

        {myFoods.length === 0 ? (
          <p className="no-foods">No foods added by you yet.</p>
        ) : (
          <div className="my-foods-list">
            {myFoods.map((food) => (
              <div className="food-card" key={food.id}>
                <h3>{food.foodName}</h3>
                <p><strong>Location:</strong> {food.location}</p>
                <p><strong>Price:</strong> {food.price}</p>
                <p><strong>Available Till:</strong> {new Date(food.expiryTime).toLocaleString()}</p>
                <p><strong>Status:</strong> {food.status}</p>

                {food.status === "available" && (
                  <button
                    className="edit-btn"
                    onClick={() => markAsCollected(food.id)}
                  >
                    Mark as Collected
                  </button>
                )}

                <button
                  className="delete-btn"
                  onClick={() => deleteFood(food.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyFoods;
