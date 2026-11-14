const BASE = import.meta.env.VITE_API_URL ?? "";
async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.detail || res.statusText || "request failed");
  return body;
}
export const api = {
  signup: (b) => request("/api/auth/signup", { method: "POST", body: JSON.stringify(b) }),
  login: (b) => request("/api/auth/login", { method: "POST", body: JSON.stringify(b) }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  me: () => request("/api/auth/me"),
  stations: () => request("/api/stations"),
  recommendations: () => request("/api/recommendations"),
  myBookings: () => request("/api/bookings/me"),
  createBooking: (b) => request("/api/bookings", { method: "POST", body: JSON.stringify(b) }),
  cancelBooking: (id) => request(`/api/bookings/${id}/cancel`, { method: "POST" }),
  history: () => request("/api/history"),
  operatorStations: () => request("/api/operator/stations"),
  operatorBookings: () => request("/api/operator/bookings"),
  analytics: () => request("/api/operator/analytics"),
};
