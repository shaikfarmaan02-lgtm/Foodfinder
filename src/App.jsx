import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FindFood from "./pages/FindFood";
import AddFood from "./pages/AddFood";
import FoodDetails from "./pages/FoodDetails";
import Profile from "./pages/Profile";
import MyFoods from "./pages/MyFoods";
import Contact from "./pages/Contact";
import Feedback from "./pages/Feedback";
import AdminDashboard from "./pages/AdminDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import PendingApproval from "./pages/PendingApproval";
import Unauthorized from "./pages/Unauthorized";

function App() {
  /* ================= FOOD LIST (PERSISTENT) ================= */
  const [foodList, setFoodList] = useState(() => {
    const savedFood = localStorage.getItem("foodList");
    if (!savedFood) return [];
    
    const parsed = JSON.parse(savedFood);
    // Remove duplicates based on foodName, location, expiryTime, and giverName
    const uniqueFoods = parsed.filter((food, index, self) =>
      index === self.findIndex((f) =>
        f.foodName === food.foodName &&
        f.location === food.location &&
        f.expiryTime === food.expiryTime &&
        f.giverName === food.giverName
      )
    );
    return uniqueFoods;
  });

  /* ================= ROLE STATE ================= */
  const [role, setRole] = useState(() => {
    return localStorage.getItem("role");
  });

  const [approvalStatus, setApprovalStatus] = useState(() => {
    return localStorage.getItem("approvalStatus");
  });

  /* ================= SAVE FOOD LIST ================= */
  useEffect(() => {
    localStorage.setItem("foodList", JSON.stringify(foodList));
  }, [foodList]);

  /* ================= AUTO-DELETE EXPIRED FOOD ================= */
  useEffect(() => {
    const cleanupExpiredFood = () => {
      const now = new Date();
      setFoodList(prev => {
        const validFood = prev.filter(food => 
          new Date(food.expiryTime) > now || food.status === "collected"
        );
        // Only update if something was removed
        if (validFood.length !== prev.length) {
          console.log(`Auto-removed ${prev.length - validFood.length} expired food item(s)`);
          return validFood;
        }
        return prev;
      });
    };

    // Run cleanup on mount
    cleanupExpiredFood();

    // Run cleanup every 5 minutes (300000ms)
    const interval = setInterval(cleanupExpiredFood, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  /* ================= SYNC ROLE ON LOGIN / LOGOUT ================= */
  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
      setApprovalStatus(localStorage.getItem("approvalStatus"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () =>
      window.removeEventListener("storage", handleStorageChange);
  }, []);

  /* ================= DELETE FOOD (GIVER) ================= */
  const deleteFood = (id) => {
    setFoodList((prev) =>
      prev.filter((food) => food.id !== id)
    );
  };

  /* ================= MARK AS COLLECTED (GIVER) ================= */
  const markAsCollected = (id) => {
    setFoodList((prev) =>
      prev.map((food) =>
        food.id === id
          ? { ...food, status: "collected" }
          : food
      )
    );
  };

  return (
    <>
      <Navbar />

      <div className="page-content">
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ========== FIND FOOD (ALL LOGGED IN USERS) ========== */}
          <Route
            path="/find-food"
            element={
              <FindFood
                foodList={foodList}
                markAsCollected={markAsCollected}
                role={role}
              />
            }
          />

          {/* ========== DONOR ROUTES (APPROVED ONLY) ========== */}
          <Route
            path="/add-food"
            element={
              <ProtectedRoute allowedRoles={["giver", "admin"]} requireApproval={true}>
                <AddFood setFoodList={setFoodList} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-foods"
            element={
              <ProtectedRoute allowedRoles={["giver", "admin"]} requireApproval={true}>
                <MyFoods
                  foodList={foodList}
                  deleteFood={deleteFood}
                  markAsCollected={markAsCollected}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/donor-dashboard"
            element={
              <ProtectedRoute allowedRoles={["giver", "admin"]} requireApproval={true}>
                <DonorDashboard foodList={foodList} />
              </ProtectedRoute>
            }
          />

          {/* ========== ORGANIZATION ROUTES (APPROVED ONLY) ========== */}
          <Route
            path="/organization-dashboard"
            element={
              <ProtectedRoute allowedRoles={["organization", "admin"]} requireApproval={true}>
                <OrganizationDashboard
                  foodList={foodList}
                  setFoodList={setFoodList}
                />
              </ProtectedRoute>
            }
          />

          {/* ========== ANALYST ROUTES (READ-ONLY) ========== */}
          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={["analyst", "admin"]} requireApproval={false}>
                <AnalyticsDashboard foodList={foodList} />
              </ProtectedRoute>
            }
          />

          {/* ========== ADMIN ROUTES ========== */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]} requireApproval={false}>
                <AdminDashboard
                  foodList={foodList}
                  setFoodList={setFoodList}
                />
              </ProtectedRoute>
            }
          />

          {/* ========== OPTIONAL ROUTES ========== */}
          <Route path="/food/:id" element={<FoodDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/feedback" element={<Feedback />} />

          {/* ========== FALLBACK ========== */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
