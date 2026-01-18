import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
  sessionExpired: false,

  initializeAuth: () => {
    // SANGAT SIMPLE: Cek localStorage dan set state
    const token = localStorage.getItem("token");

    if (token) {
      const userStr = localStorage.getItem("user");
      let user = null;

      if (userStr) {
        try {
          user = JSON.parse(userStr);
        } catch (e) {
          console.error("Error parsing user:", e);
        }
      }

      set({
        isAuthenticated: true,
        user,
        token,
        error: null,
        sessionExpired: false,
      });
      console.log("✅ initializeAuth: Token found, authenticated");
    } else {
      set({
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
        sessionExpired: false,
      });
      console.log("❌ initializeAuth: No token found");
    }
  },

  login: (email, password) => {
    set({ error: null, sessionExpired: false });

    if (email === "admin@gmail.com" && password === "123456") {
      const token = "dummy-token-" + Date.now();
      const user = {
        email,
        name: "Admin User"
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({
        isAuthenticated: true,
        user,
        token,
        error: null,
        sessionExpired: false,
      });

      return { success: true, user };
    }

    set({ error: "Invalid credentials" });
    return { success: false, error: "Invalid credentials" };
  },

  logout: (expired = false) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      isAuthenticated: false,
      user: null,
      token: null,
      error: expired ? "Session expired. Please login again." : null,
      sessionExpired: expired,
    });
  },

  clearError: () => set({ error: null, sessionExpired: false }),
}));