import { useEffect, useState } from "react";
import { BrainCircuit, Zap, Clock, IndianRupee } from "lucide-react";
import { api } from "../../lib/api";

export default function Recommendations() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.recommendations().then(setItems).catch(console.error); }, []);
  return (
    <div className="page-container">
      <div className="page-heading"><p className="eyebrow">INTELLIGENT CHARGING</p><h1>Recommendations</h1><p>Stations ranked by price with available ports.</p></div>
      <div className="recommendation-banner"><BrainCircuit size={30} /><div><h3>Simple ranking, ML integration is planned</h3><p>These suggestions sort available stations by price.</p></div></div>
      <div className="feature-grid">
        {items.map((station, index) => (
          <article className="feature-card" key={station.id}>
            <span className="feature-icon">{index === 0 ? <IndianRupee /> : <Zap />}</span><p className="eyebrow">SUGGESTION {index + 1}</p><h3>{station.name}</h3><p>{station.city} · {station.charger_type} · {station.power_kw} kW</p><p><Clock size={15} /> {station.available_ports} ports available</p><strong>₹{station.price_per_kwh}/kWh</strong>
          </article>
        ))}
      </div>
    </div>
  );
}
