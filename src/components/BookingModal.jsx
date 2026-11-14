import { useState } from "react";
import { api } from "../lib/api";

function roundNextHalfHour() {
  const d = new Date();
  d.setMinutes(Math.ceil(d.getMinutes() / 30) * 30, 0, 0);
  return d.toISOString().slice(0, 16);
}
function addMinutes(iso, m) {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() + m);
  return d.toISOString().slice(0, 16);
}

export default function BookingModal({ station, onClose, onBooked }) {
  const available = (station.ports || []).filter((p) => p.status === "available");
  const [portId, setPortId] = useState(available[0]?.id);
  const [start, setStart] = useState(roundNextHalfHour);
  const [endTime, setEndTime] = useState(() => addMinutes(roundNextHalfHour(), 30));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function updateStart(v) { setStart(v); setEndTime(addMinutes(v, 30)); }

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      await api.createBooking({ port_id: portId, start_time: new Date(start).toISOString(), end_time: new Date(endTime).toISOString() });
      onBooked();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h3>Book at {station.name}</h3>
        <label>Port</label>
        <select value={portId} onChange={(e) => setPortId(Number(e.target.value))}>
          {available.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <label>Start</label>
        <input type="datetime-local" value={start} onChange={(e) => updateStart(e.target.value)} />
        <label>End</label>
        <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <div className="modal-actions">
          <button type="button" onClick={onClose} disabled={busy}>Cancel</button>
          <button type="submit" disabled={busy}>{busy ? "Booking…" : "Confirm"}</button>
        </div>
      </form>
    </div>
  );
}
