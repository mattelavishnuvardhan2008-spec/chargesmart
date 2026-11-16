import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, CalendarDays, History, BrainCircuit } from "lucide-react";
import { api } from "../../lib/api";

export default function UserDashboard() {
  const [stations, setStations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.stations(), api.myBookings(), api.history()])
      .then(([s, b, h]) => { setStations(s); setBookings(b); setSessions(h); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner"></div>;

  const available = stations.filter((s) => s.available_ports > 0).length;
  const cards = [
    { title: "Find Charging Stations", text: `${available} stations have available ports.`, to: "/user/stations", icon: MapPin },
    { title: "My Bookings", text: "View your reservations.", to: "/user/bookings", icon: CalendarDays },
    { title: "Charging History", text: "Review past sessions and costs.", to: "/user/history", icon: History },
    { title: "AI Recommendations", text: "Explore intelligent charging.", to: "/user/recommendations", icon: BrainCircuit },
  ];

  return (
    <div className="page-container">
      <div className="page-heading"><p className="eyebrow">CUSTOMER PORTAL</p><h1>Welcome to ChargeSmart</h1><p>Plan your charging journey from one place.</p></div>
      <div className="stats-grid">
        <div className="stat-card"><span>Stations</span><strong>{stations.length}</strong></div>
        <div className="stat-card"><span>Available Stations</span><strong>{available}</strong></div>
        <div className="stat-card"><span>Your Bookings</span><strong>{bookings.length}</strong></div>
        <div className="stat-card"><span>Past Sessions</span><strong>{sessions.length}</strong></div>
      </div>
      <h2 className="section-title">Your charging workspace</h2>
      <div className="feature-grid">
        {cards.map(({ title, text, to, icon: Icon }) => (
          <Link className="feature-card" to={to} key={title}><span className="feature-icon"><Icon size={24} /></span><h3>{title}</h3><p>{text}</p><span className="feature-link">Open page →</span></Link>
        ))}
      </div>
    </div>
  );
}
