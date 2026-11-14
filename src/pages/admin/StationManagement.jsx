import { useEffect, useState } from "react";
import { Search, MapPin } from "lucide-react";
import { api } from "../../lib/api";

export default function StationManagement() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  useEffect(() => { api.operatorStations().then(setItems).catch(console.error); }, []);
  const filtered = items.filter((s) => `${s.name} ${s.city} ${s.address}`.toLowerCase().includes(query.toLowerCase().trim()));
  return (
    <div className="page-container">
      <div className="page-heading"><p className="eyebrow">OPERATOR WORKSPACE</p><h1>Station Management</h1><p>Inspect station locations, charging capacity, and live status.</p></div>
      <label className="search-field"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search stations…" /></label>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>Station</th><th>Location</th><th>Charger</th><th>Power</th><th>Ports</th><th>Availability</th></tr></thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}><td><strong>{s.name}</strong></td><td><MapPin size={14} /> {s.city}, {s.address}</td><td>{s.charger_type}</td><td>{s.power_kw} kW</td><td>{s.available_ports}/{s.total_ports} free</td><td><span className={`status-pill ${s.available_ports ? "available" : "busy"}`}>{s.available_ports ? "Available" : "Busy"}</span></td></tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state">No stations found.</div>}
      </div>
    </div>
  );
}
