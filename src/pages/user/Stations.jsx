import { useEffect, useMemo, useState } from "react";
import { MapPin, Search, Zap, CalendarPlus } from "lucide-react";
import { api } from "../../lib/api";
import BookingModal from "../../components/BookingModal.jsx";

export default function Stations() {
  const [stations, setStations] = useState([]);
  const [discovery, setDiscovery] = useState([]);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [booking, setBooking] = useState(null);

  function refresh() {
    setLoading(true);
    api.stations().then(setStations).catch((e) => setMessage(e.message)).finally(() => setLoading(false));
  }
  useEffect(refresh, []);

  useEffect(() => {
    if (showDiscovery && discovery.length === 0) {
      setLoading(true);
      api.discovery().then(setDiscovery).catch(console.error).finally(() => setLoading(false));
    }
  }, [showDiscovery, discovery.length]);

  const activeData = showDiscovery ? discovery : stations;
  const filtered = activeData.filter((s) => `${s.name} ${s.city}`.toLowerCase().includes(query.toLowerCase().trim()));
  function onBooked() { setBooking(null); setMessage("Booking confirmed."); refresh(); }

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="page-container">
      <div className="page-heading"><p className="eyebrow">CHARGING NETWORK</p><h1>Find Charging Stations</h1></div>
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => setShowDiscovery(false)} className={!showDiscovery ? "primary-button" : "text-button"} style={{ padding: "10px 20px", width: "auto", background: !showDiscovery ? "#16865f" : "#eef3ee", color: !showDiscovery ? "white" : "#35483b" }}>ChargeSmart Network</button>
        <button onClick={() => setShowDiscovery(true)} className={showDiscovery ? "primary-button" : "text-button"} style={{ padding: "10px 20px", width: "auto", background: showDiscovery ? "#16865f" : "#eef3ee", color: showDiscovery ? "white" : "#35483b" }}>Public Discovery (OCM)</button>
      </div>

      <div className="filter-bar">
        <label className="search-field"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search station or city" /></label>
      </div>
      
      {message && <p className="success-message">{message}</p>}
      
      <div className="station-grid">
        {filtered.map((station) => (
          <article className="station-card" key={station.id}>
            <div className="station-card-heading">
              <span className="feature-icon"><Zap size={22} /></span>
              <span className={`status-pill ${showDiscovery ? "busy" : (station.available_ports ? "available" : "busy")}`}>
                {showDiscovery ? "External API" : (station.available_ports ? "Available" : "Busy")}
              </span>
            </div>
            <h3>{station.name}</h3>
            <p className="muted"><MapPin size={14} /> {station.address}, {station.city}</p>
            <div className="station-details">
              <div><span>Charger</span><strong>{station.charger_type}</strong></div>
              <div><span>Power</span><strong>{station.power_kw} kW</strong></div>
              <div><span>Price</span><strong>{showDiscovery ? "N/A" : `₹${station.price_per_kwh}/kWh`}</strong></div>
              <div><span>Ports free</span><strong>{station.available_ports}/{station.total_ports}</strong></div>
            </div>
            {!showDiscovery ? (
              <button className="primary-button" onClick={() => setBooking(station)} disabled={!station.available_ports}>
                <CalendarPlus size={17} />{station.available_ports ? "Book now" : "Currently busy"}
              </button>
            ) : (
              <button className="primary-button" disabled style={{ background: "#ccc", cursor: "not-allowed" }}>External Station</button>
            )}
          </article>
        ))}
      </div>
      {booking && <BookingModal station={booking} onClose={() => setBooking(null)} onBooked={onBooked} />}
    </div>
  );
}
