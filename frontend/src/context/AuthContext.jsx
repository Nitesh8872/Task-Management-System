import { createContext, useContext, useState, useEffect, useRef } from "react";
import { getCurrentUser } from "../services/api";

// ── Context ──
const AuthContext = createContext(null);

// ── Provider ──
export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [user, setUser] = useState(null);
  // loading is only true on the very first mount while we verify a stored token
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("token")));
  const didMount = useRef(false);

  useEffect(() => {
    // Guard: only run once on initial mount to restore the session
    if (didMount.current) return;
    didMount.current = true;

    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    const restoreSession = async () => {
      try {
        const userData = await getCurrentUser(storedToken);
        setUser(userData);
      } catch {
        console.error("Session restore failed — clearing token.");
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []); // intentionally empty — runs only on mount

  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        color: "var(--color-text-muted, #888)",
        fontSize: "14px",
        gap: "10px",
      }}>
        <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span>
        Restoring session...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ token, user, setUser, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}

export default AuthContext;
