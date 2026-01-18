import React from "react";  
import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./store/useAuthStore";
import './index.css';

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    console.log("📱 App mounted - initializing auth");
    initializeAuth();
  }, [initializeAuth]);

  return <AppRoutes />;
}

export default App;