import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, UserRound, Building2, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault(); setError("");
    if (!email.trim() || !password) { setError("Please fill in email and password."); return; }
    setBusy(true);
    try {
      const r = mode === "signup" ? await signup(email.trim(), password, role) : await login(email.trim(), password);
      navigate(r.role === "admin" ? "/admin" : "/user", { replace: true });
    } catch (err) { setError(err.message); } 
    finally { setBusy(false); }
  }

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="login-brand"><span className="login-logo"><Zap size={25} fill="currentColor" /></span><span>ChargeSmart</span></div>
        <div className="login-hero">
          <span className="login-kicker">INTELLIGENT EV CHARGING</span>
          <h1>Power your journey.<br />Charge smarter.</h1>
          <p>Discover charging stations, manage reservations, and make better decisions with intelligent charging insights.</p>
          <div className="login-feature"><span><Zap size={19} /></span><div><strong>Smarter charging</strong><p>One platform for EV drivers and station operators.</p></div></div>
        </div>
        <div className="login-visual-footer">ELECTRIC MOBILITY · REIMAGINED</div>
      </section>

      <section className="login-form-section">
        <form className="login-form" onSubmit={submit}>
          <span className="login-kicker">WELCOME TO CHARGESMART</span>
          <h2>{mode === "login" ? "Sign in to continue" : "Create your account"}</h2>
          <p className="login-description">{mode === "login" ? "Enter your credentials to access your portal." : "Choose your role and create an account."}</p>

          {mode === "signup" && (
            <div className="role-options">
              <button type="button" className={`role-option ${role === "customer" ? "selected" : ""}`} onClick={() => setRole("customer")}>
                <UserRound size={22} /><span><strong>EV Driver</strong><small>Find and book chargers</small></span><span className="role-radio">{role === "customer" ? "●" : "○"}</span>
              </button>
              <button type="button" className={`role-option ${role === "admin" ? "selected" : ""}`} onClick={() => setRole("admin")}>
                <Building2 size={22} /><span><strong>Station Operator</strong><small>Manage stations and analytics</small></span><span className="role-radio">{role === "admin" ? "●" : "○"}</span>
              </button>
            </div>
          )}

          <label className="login-label" htmlFor="email">Email address</label>
          <input id="email" className="login-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label className="login-label" htmlFor="password">Password</label>
          <input id="password" className="login-input" type="password" placeholder={mode === "signup" ? "At least 6 characters" : "Your password"} value={password} onChange={(e) => setPassword(e.target.value)} required />

          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" className="login-submit" disabled={busy}>{busy ? "Please wait…" : (mode === "login" ? "Sign in" : "Create account")}<ArrowRight size={18} /></button>

          <div className="demo-notice">
            <ShieldCheck size={18} />
            <span>
              <strong>{mode === "login" ? "New to ChargeSmart?" : "Already have an account?"}</strong>
              <small><a href="#" onClick={(e) => { e.preventDefault(); setMode(mode === "login" ? "signup" : "login"); setError(""); }} style={{ color: "#16865f", fontWeight: 700 }}>{mode === "login" ? "Create an account" : "Sign in instead"}</a></small>
            </span>
          </div>
        </form>
      </section>
    </main>
  );
}
