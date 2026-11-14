import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
const Ctx = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.me().then(setUser).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);
  async function login(email, password) { await api.login({ email, password }); setUser(await api.me()); }
  async function signup(email, password, role) { await api.signup({ email, password, role }); setUser(await api.me()); }
  async function logout() { await api.logout(); setUser(null); }
  return <Ctx.Provider value={{ user, loading, login, signup, logout }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
