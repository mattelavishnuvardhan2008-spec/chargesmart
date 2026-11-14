import { useEffect, useMemo, useState } from "react";
import { MapPin, Search, Zap, CalendarPlus } from "lucide-react";
import { api } from "../../lib/api";
import BookingModal from "../../components/BookingModal.jsx";

export default function Stations() {
  const [stations, setStations] = useState([]);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All");
  const [type, setType] = useState("All");
  const [message, setMessage] = useState("");
  const [booking, setBooking] = useState(null);

  function refresh() { api.stations().then(setStations).catch((e) => setMessage(e.message)); }
  useEffect(refresh, []);
  const cities = useMemo(() => [...new Set(stations.map((s) => s.city))], [stations]);
  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim();
    return stations.filter((s) => `${s.name} ${s.city} ${s.address}`.toLowerCase().includes(term) && (city === "All" || s.city === city) && (type === "All" || s.charger_type === type));
  }, [stations, query, city, type]);
  function onBooked() { setBooking(null); setMessage("Booking confirmed."); refresh(); }

  return (
    <div className="page-container">
      <div className="page-heading"><p className="eyebrow">CHARGING NETWORK</p><h1>Find Charging Stations</h1><p>Search and compare available stations.</p></div>
      <div className="filter-bar">
        <label className="search-field"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search station, city or address" /></label>
        <select value={city} onChange={(e) => setCity(e.target.value)}><option value="All">All Cities</option>{cities.map((c) => <option key={c}>{c}</option>)}</select>
        <select value={type} onChange={(e) => setType(e.target.value)}><option value="All">All Charger Types</option><option value="AC">AC</option><option value="DC Fast">DC Fast</option></select>
      </div>
      {message && <p className="success-message">{message}</p>}
      <p className="results-count">Showing {filtered.length} of {stations.length} stations</p>
      <div className="station-grid">
        {filtered.map((station) => (
          <article className="station-card" key={station.id}>
            <div className="station-card-heading"><span className="feature-icon"><Zap size={22} /></span><span className={`status-pill ${station.available_ports ? "available" : "busy"}`}>{station.available_ports ? "Available" : "Busy"}</span></div>
            <h3>{station.name}</h3>
            <p className="muted"><MapPin size={14} /> {station.address}, {station.city}</p>
            <div className="station-details">
              <div><span>Charger</span><strong>{station.charger_type}</strong></div><div><span>Power</span><strong>{station.power_kw} kW</strong></div><div><span>Price</span><strong>₹{station.price_per_kwh}/kWh</strong></div><div><span>Ports free</span><strong>{station.available_ports}/{station.total_ports}</strong></div>
            </div>
            <button className="primary-button" onClick={() => setBooking(station)} disabled={!station.available_ports}><CalendarPlus size={17} />{station.available_ports ? "Book now" : "Currently busy"}</button>
          </article>
        ))}
      </div>
      {filtered.length === 0 && <div className="empty-state">No stations match your filters.</div>}
      {booking && <BookingModal station={booking} onClose={() => setBooking(null)} onBooked={onBooked} />}
    </div>
  );
}
