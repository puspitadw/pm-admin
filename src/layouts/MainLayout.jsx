import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    },
    {
      path: "/design",
      label: "Design Flow",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    },
  ];

  const isActive = (path) => location.pathname === path;
  const isDesignPage = location.pathname === "/design";

  const containerStyle = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f9fafb",
    overflow: "hidden",
  };

  const mobileHeaderStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
    background: "linear-gradient(90deg, #0f766e 0%, #0891b2 100%)",
    color: "white",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  };

  const mobileHeaderLeftStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const mobileMenuButtonStyle = {
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    background: "rgba(255, 255, 255, 0.1)",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const mobileHeaderTitleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    margin: 0,
  };

  const sidebarStyle = {
    display: isMobileMenuOpen ? "flex" : "none",
    flexDirection: "column",
    width: "280px",
    background: "linear-gradient(180deg, #0f766e 0%, #115e59 100%)",
    color: "white",
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 1000,
    boxShadow: "4px 0 20px rgba(0, 0, 0, 0.15)",
  };

  const sidebarHeaderStyle = {
    padding: "24px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  };

  const sidebarLogoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
  };

  const sidebarLogoIconStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #5eead4 0%, #14b8a6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "18px",
  };

  const sidebarLogoTextStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #5eead4 0%, #14b8a6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: 0,
  };

  const sidebarSubtitleStyle = {
    fontSize: "12px",
    color: "#a7f3d0",
    opacity: 0.8,
    margin: 0,
  };

  const navStyle = {
    padding: "16px",
    flex: 1,
  };

  const navItemStyle = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "8px",
    border: "none",
    background: active
      ? "rgba(255, 255, 255, 0.15)"
      : "transparent",
    color: active ? "white" : "#d1fae5",
    cursor: "pointer",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: active ? "600" : "500",
    borderLeft: active ? "4px solid #5eead4" : "4px solid transparent",
    transition: "all 0.2s ease",
  });

  const backToDashboardButtonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "16px",
    border: "none",
    background: "linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)",
    color: "#5eead4",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    borderLeft: "4px solid #5eead4",
    transition: "all 0.2s ease",
    width: "100%",
  };

  const userPanelStyle = {
    padding: "20px",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.05)",
  };

  const userInfoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const userAvatarStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "white",
  };

  const userDetailsStyle = {
    flex: 1,
    minWidth: 0,
  };

  const userNameStyle = {
    fontSize: "14px",
    fontWeight: "600",
    margin: "0 0 2px 0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const userRoleStyle = {
    fontSize: "12px",
    color: "#a7f3d0",
    opacity: 0.7,
    margin: 0,
  };

  const logoutButtonStyle = {
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    background: "rgba(255, 255, 255, 0.1)",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const mainContentStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const desktopHeaderStyle = {
    display: "none",
    padding: "20px 24px",
    background: "white",
    borderBottom: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  };

  const desktopHeaderContentStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  };

  const desktopHeaderLeftStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  const desktopTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
    margin: 0,
  };

  const desktopSubtitleStyle = {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  };

  const desktopHeaderRightStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  };

  const welcomeBadgeStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    background: "linear-gradient(90deg, #f0fdfa 0%, #e0f2fe 100%)",
    borderRadius: "8px",
    border: "1px solid #a7f3d0",
  };

  const welcomeDotStyle = {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#14b8a6",
    animation: "pulse 1.5s infinite",
  };

  const desktopLogoutButtonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
    transition: "all 0.2s ease",
  };

  const desktopBackButtonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    background: "linear-gradient(135deg, #0f766e 0%, #0891b2 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
    transition: "all 0.2s ease",
    marginRight: "12px",
  };

  const mobileInfoBarStyle = {
    padding: "12px 16px",
    background: "linear-gradient(90deg, #f0fdfa 0%, #e0f2fe 100%)",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const mobileInfoLeftStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const mobileStatusDotStyle = {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#14b8a6",
  };

  const mobileStatusTextStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#1f2937",
  };

  const mobileLogoutButtonStyle = {
    padding: "6px 12px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
  };

  const mobileBackButtonStyle = {
    padding: "6px 12px",
    background: "linear-gradient(135deg, #0f766e 0%, #0891b2 100%)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    marginRight: "8px",
  };

  const contentAreaStyle = {
    flex: 1,
    overflow: "auto",
    background: "linear-gradient(135deg, #f9fafb 0%, #f0fdfa 30%, #e0f2fe 100%)",
  };

  const mobileFooterStyle = {
    padding: "12px 16px",
    background: "white",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
  };

  const mobileFooterButtonStyle = (active) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    background: active ? "#f0fdfa" : "transparent",
    color: active ? "#0f766e" : "#6b7280",
    cursor: "pointer",
    minWidth: "60px",
  });

  const mobileFooterIconStyle = {
    width: "20px",
    height: "20px",
  };

  const mobileFooterLabelStyle = {
    fontSize: "11px",
    fontWeight: "500",
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  };

  const mediaQueries = `
        @media (min-width: 768px) {
            .mobile-header { display: none; }
            .mobile-info-bar { display: none; }
            .mobile-footer { display: none; }
            .desktop-header { display: flex; }
            .sidebar { display: flex; position: relative; }
        }
        
        @media (max-width: 767px) {
            .desktop-header { display: none; }
            .sidebar { width: 280px; }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    `;

  const handleBackToDashboard = () => {
    navigate("/dashboard");
    setIsMobileMenuOpen(false);
  };

  return (
    <div style={containerStyle}>
      {/* Add CSS for animations and responsive */}
      <style>{mediaQueries}</style>

      {/* Mobile Header */}
      <header className="mobile-header" style={mobileHeaderStyle}>
        <div style={mobileHeaderLeftStyle}>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={mobileMenuButtonStyle}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          <h1 style={mobileHeaderTitleStyle}>NiFi Flow</h1>
        </div>
        <div style={{ fontSize: "14px", fontWeight: "500" }}>
          {user?.email?.split('@')[0]}
        </div>
      </header>

      {/* Sidebar */}
      <aside className="sidebar" style={sidebarStyle}>
        <div style={sidebarHeaderStyle}>
          <div style={sidebarLogoStyle}>
            <div style={sidebarLogoIconStyle}>NF</div>
            <h1 style={sidebarLogoTextStyle}>NiFi Flow</h1>
          </div>
          <p style={sidebarSubtitleStyle}>Project Management Tool</p>
        </div>

        <nav style={navStyle}>
          {/* TAMBAH: Tombol Back to Dashboard di sidebar (hanya tampil di halaman design) */}
          {isDesignPage && (
            <button
              onClick={handleBackToDashboard}
              style={backToDashboardButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(20, 184, 166, 0.3) 0%, rgba(6, 182, 212, 0.3) 100%)";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          )}

          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
              style={navItemStyle(isActive(item.path))}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={item.icon} />
              </svg>
              <span>{item.label}</span>
              {isActive(item.path) && (
                <div style={{ marginLeft: "auto", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#5eead4" }} />
              )}
            </button>
          ))}
        </nav>

        <div style={userPanelStyle}>
          <div style={userInfoStyle}>
            <div style={userAvatarStyle}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div style={userDetailsStyle}>
              <p style={userNameStyle}>{user?.email}</p>
              <p style={userRoleStyle}>Administrator</p>
            </div>
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              style={logoutButtonStyle}
              aria-label="Logout"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={mainContentStyle}>
        {/* Desktop Header */}
        <header className="desktop-header" style={desktopHeaderStyle}>
          <div style={desktopHeaderContentStyle}>
            <div style={desktopHeaderLeftStyle}>
              <h2 style={desktopTitleStyle}>
                {isActive('/dashboard') ? 'Dashboard' : 'Flow Designer'}
              </h2>
              <p style={desktopSubtitleStyle}>
                {isActive('/dashboard')
                  ? 'Manage your project workflows'
                  : 'Design and configure your workflow'
                }
              </p>
            </div>
            <div style={desktopHeaderRightStyle}>
              {/* TAMBAH: Tombol Back to Dashboard di header desktop (hanya di halaman design) */}
              {isDesignPage && (
                <button
                  onClick={handleBackToDashboard}
                  style={desktopBackButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(15, 118, 110, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </button>
              )}

              <div style={welcomeBadgeStyle}>
                <div style={welcomeDotStyle} />
                <span style={{ fontSize: "14px", color: "#1f2937", fontWeight: "500" }}>Welcome back!</span>
              </div>
              <button
                onClick={logout}
                style={desktopLogoutButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(220, 38, 38, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Info Bar */}
        <div className="mobile-info-bar" style={mobileInfoBarStyle}>
          <div style={mobileInfoLeftStyle}>
            <div style={mobileStatusDotStyle} />
            <span style={mobileStatusTextStyle}>
              {isActive('/dashboard') ? 'Dashboard' : 'Design Mode'}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* TAMBAH: Tombol Back di mobile info bar (hanya di halaman design) */}
            {isDesignPage && (
              <button
                onClick={handleBackToDashboard}
                style={mobileBackButtonStyle}
              >
                ← Back
              </button>
            )}
            <button
              onClick={logout}
              style={mobileLogoutButtonStyle}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={contentAreaStyle}>
          {children}
        </div>

        {/* Mobile Footer */}
        <footer className="mobile-footer" style={mobileFooterStyle}>
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={mobileFooterButtonStyle(isActive(item.path))}
            >
              <svg style={mobileFooterIconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={item.icon} />
              </svg>
              <span style={mobileFooterLabelStyle}>{item.label}</span>
            </button>
          ))}
        </footer>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          style={overlayStyle}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}