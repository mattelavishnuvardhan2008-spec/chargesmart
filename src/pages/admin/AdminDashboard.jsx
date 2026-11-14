import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPinned, CalendarCheck, BrainCircuit, ChartNoAxesCombined, Zap } from "lucide-react";
import { api } from "../../lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ station_count: 0, total_ports: 0, free_ports: 0, bookings_count: 0 });
  useEffect(() => { api.analytics().then(setStats).catch(console.error); }, []);
  const metrics = [{ label: "Stations", value: stats.station_count },{ label: "Total Ports", value: stats.total_ports },{ label: "Available Ports", value: stats.free_ports },{ label: "Bookings", value: stats.bookings_count }];
  const links = [{ title: "Station Management", text: "View station records and capacity.", to: "/admin/stations", icon: MapPinned },{ title: "Booking Management", text: "View all customer reservations.", to: "/admin/bookings", icon: CalendarCheck },{ title: "AI Forecasting", text: "Explore the demand-forecasting workspace.", to: "/admin/forecasting", icon: BrainCircuit },{ title: "Analytics & Reports", text: "Review network metrics.", to: "/admin/analytics", icon: ChartNoAxesCombined }];

  return (
    <div className="page-container">
      <div className="page-heading"><p className="eyebrow">OPERATOR PORTAL</p><h1>Station Management Overview</h1><p>Monitor the charging network from one workspace.</p></div>
      <div className="stats-grid">{metrics.map((m) => <div className="stat-card" key={m.label}><span>{m.label}</span><strong>{m.value}</strong><small>Live data</small></div>)}</div>
      <div className="recommendation-banner"><Zap size={28} /><div><h3>Forecasting not yet connected</h3><p>The forecasting page is a placeholder.</p></div></div>
      <h2 className="section-title">Management workspace</h2>
      <div className="feature-grid">
        {links.map(({ title, text, to, icon: Icon }) => (
          <Link className="feature-card" to={to} key={title}><span className="feature-icon"><Icon size={23} /></span><h3>{title}</h3><p>{text}</p><span className="feature-link">Open workspace →</span></Link>
        ))}
      </div>
    </div>
  );
}
