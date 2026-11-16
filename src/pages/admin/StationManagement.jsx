import { useEffect, useState } from "react";
import { Search, MapPin, Trash2, Plus } from "lucide-react";
import { api } from "../../lib/api";

export default function StationManagement() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", city: "", address: "", charger_type: "DC Fast", power_kw: 60, price_per_kwh: 18, total_ports: 1 });

  function loadStations() {
    setLoading(true);
    api.operatorStations().then(setItems).catch(console.error).finally(() => setLoading(false));
  }
  useEffect(loadStations, []);

  async function handleAdd(e) {
    e.preventDefault();
    try {
      await api.createStation(form);
      setShowForm(false);
      loadStations();
    } catch (err) { alert(err.message); }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this station?")) return;
    try {
      await api.deleteStation(id);
      loadStations();
    } catch (err) { alert(err.message); }
  }

  const filtered = items.filter((s) => `${s.name} ${s.city}`.toLowerCase().includes(query.toLowerCase().trim()));

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="page-container">
      <div className="page-heading" style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <p className="eyebrow">OPERATOR WORKSPACE</p>
          <h1>Station Management</h1>
        </div>
        <button className="primary-button" style={{ width: "auto", padding: "0 20px" }} onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> {showForm ? "Cancel" : "Add Station"}
        </button>
      </div>

      {showForm && (
        <div className="panel" style={{ marginBottom: "20px" }}>
          <form onSubmit={handleAdd} style={{ display: "grid", gap: "10px", gridTemplateColumns: "1fr 1fr" }}>
            <input className="login-input" placeholder="Station Name" required onChange={e => setForm({...form, name: e.target.value})} />
            <input className="login-input" placeholder="City" required onChange={e => setForm({...form, city: e.target.value})} />
            <input className="login-input" placeholder="Address" required onChange={e => setForm({...form, address: e.target.value})} />
            <select className="login-input" onChange={e => setForm({...form, charger_type: e.target.value})}>
              <option value="DC Fast">DC Fast</option>
              <option value="AC">AC</option>
            </select>
            <input className="login-input" type="number" placeholder="Power (kW)" required onChange={e => setForm({...form, power_kw: Number(e.target.value)})} />
            <input className="login-input" type="number" placeholder="Price (₹/kWh)" required onChange={e => setForm({...form, price_per_kwh: Number(e.target.value)})} />
            <input className="login-input" type="number" placeholder="Total Ports" required onChange={e => setForm({...form, total_ports: Number(e.target.value)})} />
            <button type="submit" className="primary-button">Save Station</button>
          </form>
        </div>
      )}

      <label className="search-field" style={{ marginBottom: "20px" }}>
        <Search size={18} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search stations…" />
      </label>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>Station</th><th>Location</th><th>Ports</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td><strong>{s.name}</strong></td>
                <td><MapPin size={14} /> {s.city}</td>
                <td>{s.available_ports}/{s.total_ports} free</td>
                <td>
                  <button onClick={() => handleDelete(s.id)} style={{ border: 0, background: "transparent", color: "red", cursor: "pointer" }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state">No stations found.</div>}
      </div>
    </div>
  );
}
