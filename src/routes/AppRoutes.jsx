import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Design from "../pages/Design";
import { useAuthStore } from "../store/useAuthStore";

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Cek juga localStorage langsung sebagai backup
  const token = localStorage.getItem("token");

  // Jika tidak ada token sama sekali, langsung redirect
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Jika ada token tapi state belum update (race condition), 
  // beri waktu sebentar untuk state sync
  if (!isAuthenticated && token) {
    // Bisa tampilkan loading spinner sebentar
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Loading authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/design"
        element={
          <ProtectedRoute>
            <Design />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}