import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Zap, LayoutDashboard, MapPinned, CalendarCheck, BrainCircuit, ChartNoAxesCombined, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const links = [["/admin", "Overview", LayoutDashboard, true],["/admin/stations", "Station Management", MapPinned],["/admin/bookings", "Booking Management", CalendarCheck],["/admin/forecasting", "AI Forecasting", BrainCircuit],["/admin/analytics", "Analytics & Reports", ChartNoAxesCombined]];
  async function handleLogout() { await logout(); navigate("/login", { replace: true }); }

  return (
    <div className="portal-shell">
      <aside className="portal-sidebar">
        <div className="portal-brand"><Zap /> ChargeSmart</div>
        <p className="portal-role-label">STATION MANAGEMENT</p>
        <nav className="portal-nav">
          {links.map(([to, label, Icon, end]) => (
            <NavLink key={to} to={to} end={Boolean(end)} className={({ isActive }) => `portal-nav-link ${isActive ? "active" : ""}`}><Icon size={19} /> {label}</NavLink>
          ))}
        </nav>
        <div className="portal-sidebar-bottom">
          <p style={{ fontSize: 11, margin: "0 0 6px", opacity: .75, wordBreak: "break-all" }}>{user?.email}</p>
          <button className="portal-logout" onClick={handleLogout}><LogOut size={17} /> Sign out</button>
        </div>
      </aside>
      <main className="portal-main">
        <header className="portal-topbar"><span>ChargeSmart / Operator Portal</span><span className="simulated-status">Signed in</span></header>
        <div className="portal-content"><Outlet /></div>
      </main>
    </div>
  );
}
