import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function History() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { api.history().then(setItems).catch((e) => setError(e.message)); }, []);
  const energy = items.reduce((s, x) => s + (x.energy_kwh || 0), 0);
  const cost = items.reduce((s, x) => s + (x.cost || 0), 0);

  return (
    <div className="page-container">
      <div className="page-heading"><p className="eyebrow">CUSTOMER PORTAL</p><h1>Charging History</h1><p>Records of completed charging sessions.</p></div>
      {error && <p className="login-error">{error}</p>}
      <div className="stats-grid two-stats">
        <div className="stat-card"><span>Total Energy</span><strong>{energy.toFixed(1)} kWh</strong></div>
        <div className="stat-card"><span>Total Cost</span><strong>₹{cost.toLocaleString("en-IN")}</strong></div>
      </div>
      <div className="history-list">
        {items.map((s) => (
          <article className="history-item" key={s.id}>
            <div><h3>{s.station_name}</h3><p>{new Date(s.started_at).toLocaleDateString()} · {s.duration_minutes || "—"} min</p></div>
            <div className="history-values"><strong>{s.energy_kwh} kWh</strong><span>₹{s.cost}</span></div>
          </article>
        ))}
        {items.length === 0 && <div className="empty-state">No charging sessions yet.</div>}
      </div>
    </div>
  );
}
