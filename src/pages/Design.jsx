import React, { useState, useEffect, useCallback } from "react";
import { ReactFlowProvider } from "reactflow";
import { useNavigate } from "react-router-dom";
import { useFlowStore } from "../store/useFlowStore";
import ProcessorSidebar from "../components/ProcessorSidebar";
import FlowCanvas from "../components/FlowCanvas";

import { useAuthStore } from "../store/useAuthStore";
import { validatePublishFlow } from "../utils/publishValidation";
import { ValidationNotification } from "../components/ValidNotification"; // PERBAIKAN: Import notification

export default function Design() {
  const currentFlowId = useFlowStore((s) => s.currentFlowId);
  const nodes = useFlowStore((s) => s.flows[currentFlowId]?.nodes ?? []);
  const edges = useFlowStore((s) => s.flows[currentFlowId]?.edges ?? []);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const user = useAuthStore((state) => state.user);
  const [isMobileDragMode, setIsMobileDragMode] = useState(false);
  const [draggedProcessor, setDraggedProcessor] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [notification, setNotification] = useState(null); // PERBAIKAN: Tambah state notification
  const [publishSuccess, setPublishSuccess] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!currentFlowId) {
      navigate("/dashboard");
    }
  }, [currentFlowId, navigate]);

  const handleMobileDragStart = (processor) => {
    setIsMobileDragMode(true);
    setDraggedProcessor(processor);
    setIsSidebarOpen(false);

    // Show visual feedback di canvas
    const canvas = document.querySelector('[data-flow-canvas]');
    if (canvas) {
      canvas.style.border = "2px dashed #0F766E";
      canvas.style.backgroundColor = "rgba(20, 184, 166, 0.05)";
    }
  };

  const handleMobileDrop = useCallback((position) => {
    if (draggedProcessor && isMobileDragMode) {
      const addNode = useFlowStore.getState().addNode;
      addNode(position, draggedProcessor.name);

      // Reset state
      setIsMobileDragMode(false);
      setDraggedProcessor(null);

      // Reset canvas visual
      const canvas = document.querySelector('[data-flow-canvas]');
      if (canvas) {
        canvas.style.border = "none";
        canvas.style.backgroundColor = "";
      }
    }
  }, [draggedProcessor, isMobileDragMode]);

  const handleCanvasTouch = useCallback((e) => {
    if (!isMobileDragMode || !draggedProcessor) return;

    e.preventDefault();

    const canvasRect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];

    const position = {
      x: touch.clientX - canvasRect.left,
      y: touch.clientY - canvasRect.top
    };

    handleMobileDrop(position);
  }, [isMobileDragMode, draggedProcessor, handleMobileDrop]);

  // PERBAIKAN: Handle publish untuk mobile/tablet
  const handlePublishClick = () => {
    const validation = validatePublishFlow(nodes, edges);

    if (validation.status === 'VALID') {
      setShowPublishModal(true);
    } else {
      // PERBAIKAN: Ganti alert() dengan notification component
      setNotification({
        message: validation.message,
        type: validation.type || 'warning',
      });
    }
  };

  // PERBAIKAN: Fungsi publish untuk mobile/tablet
  const handleMobilePublish = async () => {
    try {
      // Siapkan payload
      const publishPayload = {
        flowId: currentFlowId,
        processors: nodes.map(node => ({
          id: node.id,
          type: node.type,
          label: node.data?.label || node.label,
          position: node.position,
          data: node.data
        })),
        connections: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          type: edge.type
        })),
        metadata: {
          processorCount: nodes.length,
          connectionCount: edges.length,
          timestamp: new Date().toISOString(),
          version: "1.0"
        }
      };

      console.log("Mobile publishing:", publishPayload);

      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Set success state
      setPublishSuccess(true);

      // Redirect setelah 2 detik
      setTimeout(() => {
        setShowPublishModal(false);
        setPublishSuccess(false);
        navigate("/dashboard");
      }, 2000);

    } catch (error) {
      setNotification({
        message: "Failed to publish design. Please try again.",
        type: "error",
      });
      console.error("Publish error:", error);
    }
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const containerStyle = {
    display: "flex",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#F9FAFB",
    overflow: "hidden",
    position: "relative",
    minWidth: "320px",
  };

  const mainContentStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: isMobile ? "calc(100vh - 56px)" : "100vh",
    marginTop: isMobile ? "56px" : "0",
    overflow: "hidden",
    position: "relative",
    minWidth: "300px",
  };

  const mobileHeaderStyle = {
    display: isMobile ? "flex" : "none",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    backgroundColor: "white",
    borderBottom: "1px solid #E5E7EB",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    zIndex: 50,
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "56px",
  };

  const mobileTitleStyle = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1F2937",
    margin: 0,
  };

  const mobileMenuButtonStyle = {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #D1D5DB",
    backgroundColor: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 40,
    display: isMobile && isSidebarOpen ? "block" : "none",
  };

  const sidebarWidth = isMobile ? (isSidebarOpen ? "280px" : "0") :
    isTablet ? "280px" : "320px";

  // Profile Menu Style
  const profileMenuStyle = {
    position: "fixed",
    top: "60px",
    right: "16px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    border: "1px solid #E5E7EB",
    zIndex: 1000,
    minWidth: "200px",
    overflow: "hidden",
  };

  const profileMenuItemStyle = {
    padding: "12px 16px",
    borderBottom: "1px solid #F3F4F6",
    cursor: "pointer",
    fontSize: "14px",
    color: "#374151",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "white",
    border: "none",
    width: "100%",
    textAlign: "left",
  };

  if (!currentFlowId) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#F9FAFB",
      }}>
        <div style={{
          textAlign: "center",
          padding: "40px 24px",
          maxWidth: "400px",
        }}>
          <div style={{
            width: "64px",
            height: "64px",
            margin: "0 auto 20px",
            color: "#9CA3AF",
            animation: "spin 2s linear infinite",
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#4B5563",
            margin: "0 0 8px 0",
          }}>
            Loading Flow...
          </h3>
          <p style={{
            fontSize: "14px",
            color: "#6B7280",
            margin: 0,
          }}>
            Please wait while we prepare the design environment
          </p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <div style={containerStyle}>
        {/* Mobile Header */}
        <div style={mobileHeaderStyle}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={mobileMenuButtonStyle}
            aria-label="Toggle sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          <h2 style={mobileTitleStyle}>Flow Designer</h2>

          {/* Profile Avatar yang bisa diklik */}
          <button
            onClick={handleProfileClick}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#14B8A6",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "600",
              fontSize: "14px",
              border: "none",
              cursor: "pointer",
            }}
            aria-label="User profile"
          >
            {user?.name?.charAt(0) || user?.email?.charAt(0) || "A"}
          </button>
        </div>

        {/* Profile Menu Dropdown */}
        {showProfileMenu && (
          <>
            <div style={profileMenuStyle}>
              <div style={{
                padding: "16px",
                backgroundColor: "#F9FAFB",
                borderBottom: "1px solid #E5E7EB",
              }}>
                <p style={{ margin: "0 0 4px", fontWeight: "600", color: "#111827" }}>
                  {user?.name || "User"}
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "#6B7280" }}>
                  {user?.email || "user@example.com"}
                </p>
              </div>
              <button
                style={profileMenuItemStyle}
                onClick={() => {
                  navigate("/dashboard");
                  setShowProfileMenu(false);
                }}
                onMouseEnter={(e) => e.currentTarget.backgroundColor = "#F9FAFB"}
                onMouseLeave={(e) => e.currentTarget.backgroundColor = "white"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </button>
              <button
                style={profileMenuItemStyle}
                onClick={() => {
                  useAuthStore.getState().logout();
                  setShowProfileMenu(false);
                  navigate("/login");
                }}
                onMouseEnter={(e) => e.currentTarget.backgroundColor = "#F9FAFB"}
                onMouseLeave={(e) => e.currentTarget.backgroundColor = "white"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999,
              }}
              onClick={() => setShowProfileMenu(false)}
            />
          </>
        )}

        {/* Overlay for mobile sidebar */}
        <div
          style={overlayStyle}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div style={{
          width: sidebarWidth,
          height: isMobile ? "calc(100vh - 56px)" : "100vh",
          position: isMobile ? "fixed" : "relative",
          top: isMobile ? "56px" : "0",
          left: isMobile ? (isSidebarOpen ? "0" : `-${sidebarWidth}`) : "0",
          zIndex: 45,
          transition: "all 0.3s ease",
          overflow: "hidden",
          minWidth: isMobile ? "0" : "280px",
        }}>
          <ProcessorSidebar onMobileDragStart={handleMobileDragStart} />
        </div>

        {/* Main Content Area */}
        <div style={mainContentStyle}>
          <div
            data-flow-canvas
            onTouchStart={isMobile ? handleCanvasTouch : undefined}
            style={{ height: "100%", width: "100%" }}
          >
            {/* PERBAIKAN: Kirim prop setShowPublishModal ke FlowCanvas */}
            <FlowCanvas setShowPublishModal={setShowPublishModal} />
          </div>

          {/* Mobile Drag Indicator */}
          {isMobile && isMobileDragMode && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "auto",
            }}>
              <div style={{
                backgroundColor: "#0F766E",
                color: "white",
                padding: "24px",
                borderRadius: "16px",
                boxShadow: "0 20px 40px rgba(15, 118, 110, 0.3)",
                textAlign: "center",
                maxWidth: "320px",
                width: "90%",
              }}>
                <div style={{
                  width: "64px",
                  height: "64px",
                  margin: "0 auto 16px",
                  backgroundColor: "#14B8A6",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}>
                  {draggedProcessor?.icon || "📋"}
                </div>
                <h3 style={{
                  margin: "0 0 8px",
                  fontSize: "18px",
                  fontWeight: "600",
                }}>
                  {draggedProcessor?.name || "Processor"}
                </h3>
                <p style={{
                  margin: "0 0 24px",
                  fontSize: "14px",
                  opacity: 0.9,
                  lineHeight: "1.5",
                }}>
                  Tap anywhere on the canvas to place this processor
                </p>
                <div style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                }}>
                  <button
                    onClick={() => {
                      setIsMobileDragMode(false);
                      setDraggedProcessor(null);
                      setIsSidebarOpen(true);
                    }}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "transparent",
                      color: "#A7F3D0",
                      border: "2px solid #A7F3D0",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      minWidth: "120px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.backgroundColor = "rgba(167, 243, 208, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.backgroundColor = "transparent";
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const addNode = useFlowStore.getState().addNode;
                      addNode({ x: 200, y: 200 }, draggedProcessor?.name || "Processor");
                      setIsMobileDragMode(false);
                      setDraggedProcessor(null);
                    }}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#14B8A6",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      minWidth: "120px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.backgroundColor = "#0D9488";
                      e.currentTarget.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.backgroundColor = "#14B8A6";
                      e.currentTarget.transform = "translateY(0)";
                    }}
                  >
                    Place Here
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PERBAIKAN: Mobile Bottom Navigation dengan tombol Publish */}
        {(isMobile || isTablet) && !isMobileDragMode && (
          <div style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "white",
            borderTop: "1px solid #E5E7EB",
            padding: "8px 16px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            zIndex: 50,
            boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
          }}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                background: "none",
                border: "none",
                padding: "8px",
                color: isSidebarOpen ? "#0F766E" : "#6B7280",
                cursor: "pointer",
                flex: 1,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span style={{ fontSize: "10px", fontWeight: "500" }}>Tasks</span>
            </button>

            {/* Tombol Publish untuk mobile/tablet */}
            <button
              onClick={handlePublishClick}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                background: "none",
                border: "none",
                padding: "8px",
                color: "#0F766E",
                cursor: "pointer",
                flex: 1,
                fontWeight: "600",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span style={{ fontSize: "10px", fontWeight: "500" }}>Publish</span>
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                background: "none",
                border: "none",
                padding: "8px",
                color: "#6B7280",
                cursor: "pointer",
                flex: 1,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span style={{ fontSize: "10px", fontWeight: "500" }}>Dashboard</span>
            </button>
          </div>
        )}

        {/* PERBAIKAN: Publish Modal untuk mobile/tablet (lebih baik) */}
        {showPublishModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "24px",
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
            }}>
              {publishSuccess ? (
                <>
                  <div style={{
                    textAlign: "center",
                    marginBottom: "24px",
                  }}>
                    <div style={{
                      width: "64px",
                      height: "64px",
                      backgroundColor: "#D1FAE5",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 style={{
                      margin: "0 0 8px",
                      fontSize: "18px",
                      color: "#065F46",
                      fontWeight: "600",
                    }}>
                      Publish Successful!
                    </h3>
                    <p style={{
                      margin: 0,
                      color: "#047857",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}>
                      Your design has been published. Redirecting to dashboard...
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowPublishModal(false);
                      setPublishSuccess(false);
                      navigate("/dashboard");
                    }}
                    style={{
                      width: "100%",
                      padding: "14px",
                      backgroundColor: "#10B981",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Go to Dashboard
                  </button>
                </>
              ) : (
                <>
                  <h3 style={{
                    margin: "0 0 16px",
                    fontSize: "18px",
                    color: "#1F2937",
                    fontWeight: "600",
                  }}>
                    Ready to Publish?
                  </h3>

                  <div style={{
                    backgroundColor: "#F0F9FF",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "20px",
                    border: "1px solid #BAE6FD",
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}>
                      <span style={{ fontSize: "14px", color: "#374151" }}>Processors:</span>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#0F766E" }}>{nodes.length}</span>
                    </div>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}>
                      <span style={{ fontSize: "14px", color: "#374151" }}>Connections:</span>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#0F766E" }}>{edges.length}</span>
                    </div>
                  </div>

                  <p style={{
                    margin: "0 0 24px",
                    color: "#6B7280",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}>
                    This will publish your current design to production.
                  </p>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => setShowPublishModal(false)}
                      style={{
                        flex: 1,
                        padding: "14px",
                        backgroundColor: "#F3F4F6",
                        border: "1px solid #D1D5DB",
                        borderRadius: "8px",
                        color: "#374151",
                        fontSize: "16px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.backgroundColor = "#E5E7EB";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.backgroundColor = "#F3F4F6";
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleMobilePublish}
                      style={{
                        flex: 1,
                        padding: "14px",
                        backgroundColor: "#0F766E",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.backgroundColor = "#0D9488";
                        e.currentTarget.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.backgroundColor = "#0F766E";
                        e.currentTarget.transform = "translateY(0)";
                      }}
                    >
                      Publish
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* PERBAIKAN: Notification untuk error/warning */}
        {notification && (
          <ValidationNotification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </ReactFlowProvider>
  );
}