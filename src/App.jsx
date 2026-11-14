import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import Stations from "./pages/user/Stations.jsx";
import Bookings from "./pages/user/Bookings.jsx";
import History from "./pages/user/History.jsx";
import Recommendations from "./pages/user/Recommendations.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import StationManagement from "./pages/admin/StationManagement.jsx";
import BookingManagement from "./pages/admin/BookingManagement.jsx";
import Forecasting from "./pages/admin/Forecasting.jsx";
import Analytics from "./pages/admin/Analytics.jsx";

import "./index.css";
import "./App.css";
import "./Styles.css";

function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-content"><p>Checking session…</p></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />;
  return children;
}

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-content"><p>Checking session…</p></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/user" element={<ProtectedRoute role="customer"><UserLayout /></ProtectedRoute>}>
        <Route index element={<UserDashboard />} />
        <Route path="stations" element={<Stations />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="history" element={<History />} />
        <Route path="recommendations" element={<Recommendations />} />
      </Route>
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="stations" element={<StationManagement />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="forecasting" element={<Forecasting />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}
