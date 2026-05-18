
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import TeamGoals from "./pages/TeamGoals";
import QuarterlyReviews from "./pages/QuarterlyReviews";
import Checkins from "./pages/Checkins";
import AuditLog from "./pages/AuditLog";
import Reports from "./pages/Reports";
import axios from "axios";

// ─── Axios interceptor ────────────────────────────────────────────────────────
// Guarantees the token is saved on every successful login response.
axios.interceptors.response.use(
  (response) => {
    if (
      response.config.url.includes("/api/auth/login") &&
      response.data?.token
    ) {
      console.log("🎯 INTERCEPTOR MATCH: Forcing token into local storage!");
      localStorage.setItem("token", response.data.token);
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    }
    return response;
  },
  (error) => Promise.reject(error),
);

// ─── Loading screen ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--surface-1)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "var(--accent)",
            boxShadow: "0 0 0 1px rgba(91,108,249,0.4), 0 4px 16px rgba(91,108,249,0.35)",
            animation: "pulse 1.4s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontSize: 13,
            color: "var(--text-tertiary)",
            fontFamily: "inherit",
          }}
        >
          Loading…
        </span>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.55; transform: scale(0.9); }
          }
        `}</style>
      </div>
    </div>
  );
}

// ─── Route guards ─────────────────────────────────────────────────────────────
function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/dashboard" />;
  return children;
}

// ─── Authenticated shell ──────────────────────────────────────────────────────
function AppLayout() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="layout">
      <Sidebar />
      <Routes>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <PrivateRoute>
              <Goals />
            </PrivateRoute>
          }
        />
        <Route
          path="/team"
          element={
            <PrivateRoute roles={["manager", "admin"]}>
              <TeamGoals />
            </PrivateRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <PrivateRoute roles={["manager"]}>
              <QuarterlyReviews />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkins"
          element={
            <PrivateRoute>
              <Checkins />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute roles={["admin"]}>
              <Reports />
            </PrivateRoute>
          }
        />
        <Route
          path="/audit"
          element={
            <PrivateRoute roles={["admin"]}>
              <AuditLog />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

function PrivateLayout() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  return <AppLayout />;
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="/*" element={<PrivateLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
