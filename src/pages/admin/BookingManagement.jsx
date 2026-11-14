import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function BookingManagement() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.operatorBookings().then(setItems).catch(console.error); }, []);
  return (
    <div className="page-container">
      <div className="page-heading"><p className="eyebrow">OPERATOR WORKSPACE</p><h1>Booking Management</h1><p>Review all reservations across the network.</p></div>
      <div className="stats-grid two-stats"><div className="stat-card"><span>Bookings Displayed</span><strong>{items.length}</strong></div><div className="stat-card"><span>Confirmed</span><strong>{items.filter((b) => b.status === "confirmed").length}</strong></div></div>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>Booking</th><th>Customer</th><th>Station</th><th>Start</th><th>End</th><th>Status</th></tr></thead>
          <tbody>
            {items.map((b) => (
              <tr key={b.id}><td>#{b.id}</td><td>{b.customer}</td><td>{b.station_name} ({b.port_label})</td><td>{new Date(b.start_time).toLocaleString()}</td><td>{new Date(b.end_time).toLocaleString()}</td><td><span className={`status-pill ${b.status}`}>{b.status}</span></td></tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div className="empty-state">No bookings yet.</div>}
      </div>
    </div>
  );
}
