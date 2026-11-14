import { useEffect, useState } from "react";
import { CalendarDays, XCircle } from "lucide-react";
import { api } from "../../lib/api";

export default function Bookings() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { api.myBookings().then(setItems).catch((e) => setError(e.message)); }, []);
  async function cancel(id) {
    try { await api.cancelBooking(id); setItems((prev) => prev.map((b) => b.id === id ? { ...b, status: "cancelled" } : b)); } catch (e) { setError(e.message); }
  }
  function fmt(iso) { const d = new Date(iso); return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }

  return (
    <div className="page-container">
      <div className="page-heading"><p className="eyebrow">CUSTOMER PORTAL</p><h1>My Bookings</h1><p>Review and cancel your reservations.</p></div>
      {error && <p className="login-error">{error}</p>}
      <div className="table-wrapper">
        <table>
          <thead><tr><th>Booking</th><th>Station</th><th>Start</th><th>End</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {items.map((b) => (
              <tr key={b.id}>
                <td>#{b.id}</td><td>{b.station_name} ({b.port_label})</td><td>{fmt(b.start_time)}</td><td>{fmt(b.end_time)}</td>
                <td><span className={`status-pill ${b.status}`}>{b.status}</span></td>
                <td>{(b.status === "pending" || b.status === "confirmed") && <button className="text-button" onClick={() => cancel(b.id)}><XCircle size={16} /> Cancel</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div className="empty-state"><CalendarDays size={30} /><p>No bookings yet. Visit Find Stations to book one.</p></div>}
      </div>
    </div>
  );
}
