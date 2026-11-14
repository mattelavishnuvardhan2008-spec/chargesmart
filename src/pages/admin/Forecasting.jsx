import { BrainCircuit, Clock, TrendingUp } from "lucide-react";
const forecastExample = [{ time: "08:00", demand: 35 },{ time: "10:00", demand: 52 },{ time: "12:00", demand: 76 },{ time: "14:00", demand: 61 },{ time: "16:00", demand: 88 },{ time: "18:00", demand: 94 },{ time: "20:00", demand: 58 }];

export default function Forecasting() {
  return (
    <div className="page-container">
      <div className="page-heading"><p className="eyebrow">MACHINE LEARNING WORKSPACE</p><h1>Charging Demand Forecast</h1><p>Preview the interface for future hourly charging-demand predictions.</p></div>
      <div className="recommendation-banner"><BrainCircuit size={30} /><div><h3>Forecast model: not connected</h3><p>The values below are synthetic example data for UI review.</p></div></div>
      <div className="stats-grid"><div className="stat-card"><span>Forecast Horizon</span><strong>Hourly</strong></div><div className="stat-card"><span>Peak Example</span><strong>18:00</strong></div><div className="stat-card"><span>Model Status</span><strong>Pending</strong></div></div>
      <div className="panel">
        <h2 className="section-title">Illustrative demand profile</h2>
        <div className="forecast-list">
          {forecastExample.map((item) => (<div className="forecast-row" key={item.time}><span><Clock size={15} /> {item.time}</span><div className="forecast-track"><div className="forecast-fill" style={{ width: `${item.demand}%` }} /></div><strong>{item.demand}%</strong></div>))}
        </div>
        <p className="muted"><TrendingUp size={15} /> Synthetic illustrative demand index, not a probability.</p>
      </div>
    </div>
  );
}
