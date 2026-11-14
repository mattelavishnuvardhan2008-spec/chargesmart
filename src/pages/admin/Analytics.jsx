import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [stations, setStations] = useState([]);
  useEffect(() => { Promise.all([api.analytics(), api.operatorStations()]).then(([s, st]) => { setStats(s); setStations(st); }).catch(console.error); }, []);
  const util = stats && stats.total_ports ? Math.round(((stats.total_ports - stats.free_ports) / stats.total_ports) * 100) : 0;

  return (
    <div className="page-container">
      <div className="page-heading"><p className="eyebrow">NETWORK PERFORMANCE</p><h1>Analytics & Reports</h1><p>Operational indicators from live data.</p></div>
      {stats && <div className="stats-grid"><div className="stat-card"><span>Stations</span><strong>{stats.station_count}</strong></div><div className="stat-card"><span>Port Utilization</span><strong>{util}%</strong></div><div className="stat-card"><span>Total Energy</span><strong>{stats.energy.toFixed(1)} kWh</strong></div><div className="stat-card"><span>Session Cost</span><strong>₹{stats.cost}</strong></div></div>}
      <div className="panel">
        <h2 className="section-title">Port availability by station</h2>
        {stations.map((s) => {
          const pct = s.total_ports ? Math.round((s.available_ports / s.total_ports) * 100) : 0;
          return (<div className="forecast-row" key={s.id}><span className="analytics-station">{s.name}</span><div className="forecast-track"><div className="forecast-fill" style={{ width: `${pct}%` }} /></div><strong>{s.available_ports}/{s.total_ports}</strong></div>);
        })}
      </div>
      {stats && <div className="panel"><h2 className="section-title">Booking overview</h2><p>{stats.bookings_count} bookings in the network.</p></div>}
    </div>
  );
}
