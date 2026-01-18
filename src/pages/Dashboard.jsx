import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useFlowStore } from "../store/useFlowStore";
import { useAuthStore } from "../store/useAuthStore";

export default function Dashboard() {
  const navigate = useNavigate();
  const setCurrentFlow = useFlowStore((s) => s.setCurrentFlow);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const mockFlows = [
    {
      id: "pm-sprint",
      name: "Sprint Planning",
      description: "Plan tasks and allocate resources for the sprint",
      status: "Draft",
      updatedAt: "2026-01-10",
      icon: "📋",
      color: "#0EA5E9",
    },
    {
      id: "pm-development",
      name: "Development Flow",
      description: "Track progress of development tasks",
      status: "In Progress",
      updatedAt: "2026-01-12",
      icon: "💻",
      color: "#10B981",
    },
    {
      id: "pm-qa",
      name: "QA & Review",
      description: "Perform testing and code review before release",
      status: "Draft",
      updatedAt: "2026-01-11",
      icon: "🔍",
      color: "#8B5CF6",
    },
    {
      id: "pm-deployment",
      name: "Deployment Flow",
      description: "Manage deployment and environment updates",
      status: "Published",
      updatedAt: "2026-01-08",
      icon: "🚀",
      color: "#F59E0B",
    },
    {
      id: "pm-reporting",
      name: "Reporting Flow",
      description: "Prepare reports and analytics dashboards",
      status: "Draft",
      updatedAt: "2026-01-09",
      icon: "📊",
      color: "#EC4899",
    },
    {
      id: "pm-retrospective",
      name: "Sprint Retrospective",
      description: "Review sprint performance and feedback",
      status: "Draft",
      updatedAt: "2026-01-07",
      icon: "🔄",
      color: "#06B6D4",
    },
  ];

  const openFlow = (flowId) => {
    setCurrentFlow(flowId);
    navigate("/design");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "Published":
        return {
          backgroundColor: "#D1FAE5",
          color: "#065F46",
          borderColor: "#A7F3D0",
        };
      case "In Progress":
        return {
          backgroundColor: "#DBEAFE",
          color: "#1E40AF",
          borderColor: "#BFDBFE",
        };
      case "Draft":
        return {
          backgroundColor: "#FEF3C7",
          color: "#92400E",
          borderColor: "#FDE68A",
        };
      default:
        return {
          backgroundColor: "#F3F4F6",
          color: "#374151",
          borderColor: "#E5E7EB",
        };
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#F9FAFB",
  };

  const headerStyle = {
    background: "linear-gradient(135deg, #0F766E 0%, #115E59 100%)",
    padding: "32px 24px",
  };

  const headerContentStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const userInfoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    position: "relative",
  };

  const userAvatarStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#14B8A6",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
  };
  const userMenuStyle = {
    position: "absolute",
    top: "50px",
    right: "0",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    border: "1px solid #E5E7EB",
    minWidth: "200px",
    zIndex: "100",
  };

  const userMenuItemStyle = {
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  };

  const titleStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    color: "white",
    margin: "0 0 8px 0",
    lineHeight: "1.2",
  };

  const subtitleStyle = {
    fontSize: "16px",
    color: "rgba(255, 255, 255, 0.9)",
    margin: 0,
    lineHeight: "1.5",
  };

  const contentStyle = {
    flex: 1,
    padding: "32px 24px",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px",
    marginTop: "16px",
  };

  const cardStyle = {
    background: "white",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    cursor: "pointer",
    overflow: "hidden",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
  };

  const cardContentStyle = {
    padding: "24px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  };

  const cardHeaderStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "16px",
  };

  const iconContainerStyle = (color) => ({
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: `linear-gradient(135deg, ${color}20 0%, ${color}40 100%)`,
    border: `1px solid ${color}30`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  });

  const iconStyle = {
    fontSize: "24px",
  };

  const cardTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1F2937",
    margin: "0 0 8px 0",
    lineHeight: "1.3",
  };

  const cardDescriptionStyle = {
    fontSize: "14px",
    color: "#6B7280",
    lineHeight: "1.5",
    margin: 0,
  };

  const cardFooterStyle = {
    marginTop: "auto",
    paddingTop: "16px",
    borderTop: "1px solid #F3F4F6",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  };

  const statusStyle = (config) => ({
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: config.backgroundColor,
    color: config.color,
    border: `1px solid ${config.borderColor}`,
    whiteSpace: "nowrap",
  });

  const dateStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#9CA3AF",
  };

  // eslint-disable-next-line no-unused-vars
  const chevronStyle = {
    width: "16px",
    height: "16px",
    color: "#9CA3AF",
  };

  const accentBarStyle = {
    height: "4px",
    background: "linear-gradient(90deg, #0F766E 0%, #14B8A6 100%)",
    opacity: 0,
    transition: "opacity 0.2s ease",
  };

  const emptyStateStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    textAlign: "center",
  };

  const emptyContentStyle = {
    maxWidth: "400px",
    padding: "40px 24px",
  };

  const emptyIconStyle = {
    width: "64px",
    height: "64px",
    margin: "0 auto 20px",
    color: "#9CA3AF",
  };

  const createFlowButtonStyle = {
    marginTop: "24px",
    padding: "12px 24px",
    background: "linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  return (
    <div style={containerStyle}>
      {/* Header - MODIFIKASI untuk tambah user info */}
      <div style={headerStyle}>
        <div style={headerContentStyle}>
          <div>
            <h1 style={titleStyle}>Dashboard</h1>
            <p style={subtitleStyle}>
              Select a project workflow to view or edit its design
            </p>
          </div>

          {/* User Profile Indicator - Test Case 1.1 */}
          <div style={userInfoStyle}>
            <div
              style={userAvatarStyle}
              onClick={() => setShowUserMenu(!showUserMenu)}
              onMouseEnter={() => setShowUserMenu(true)}
            >
              {user?.name?.charAt(0) || user?.email?.charAt(0) || "A"}
            </div>

            {showUserMenu && (
              <div
                style={userMenuStyle}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
                  <div style={{ fontWeight: "600", color: "#1F2937" }}>
                    {user?.name || "Admin User"}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px" }}>
                    {user?.email || "admin@mail.com"}
                  </div>
                </div>
                <div
                  style={userMenuItemStyle}
                  onClick={handleLogout}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F9FAFB"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  <span style={{ fontSize: "14px" }}>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={contentStyle}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1F2937", margin: "0 0 8px 0" }}>
              Your Workflows
            </h2>
            <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
              {mockFlows.length} workflows available
            </p>
          </div>
        </div>

        {/* Flow Cards */}
        <div style={gridStyle}>
          {mockFlows.map((flow) => {
            const statusConfig = getStatusConfig(flow.status);

            return (
              <div
                key={flow.id}
                onClick={() => openFlow(flow.id)}
                style={cardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.borderColor = "#14B8A6";
                  const bar = e.currentTarget.querySelector('.accent-bar');
                  if (bar) bar.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  const bar = e.currentTarget.querySelector('.accent-bar');
                  if (bar) bar.style.opacity = "0";
                }}
              >
                <div style={cardContentStyle}>
                  <div style={cardHeaderStyle}>
                    <div style={iconContainerStyle(flow.color)}>
                      <span style={iconStyle}>{flow.icon}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={cardTitleStyle}>{flow.name}</h3>
                      <p style={cardDescriptionStyle}>{flow.description}</p>
                    </div>
                  </div>

                  <div style={cardFooterStyle}>
                    <span style={statusStyle(statusConfig)}>
                      {flow.status}
                    </span>
                    <div style={dateStyle}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{flow.updatedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="accent-bar" style={accentBarStyle} />
              </div>
            );
          })}
        </div>

        {mockFlows.length === 0 && (
          <div style={emptyStateStyle}>
            <div style={emptyContentStyle}>
              <div style={emptyIconStyle}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1F2937", margin: "0 0 8px 0" }}>
                No workflows yet
              </h3>
              <p style={{ fontSize: "14px", color: "#6B7280", margin: "0 0 20px 0" }}>
                Create your first workflow to get started
              </p>
              <button
                style={createFlowButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(15, 118, 110, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Create New Workflow
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}