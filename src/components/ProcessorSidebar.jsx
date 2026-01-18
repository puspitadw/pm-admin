import React, { useEffect, useState, useRef, useCallback } from "react";
import { useFlowStore } from "../store/useFlowStore";

const processorsByFlow = {
    "pm-sprint": [
        { id: "task-1", name: "Plan Tasks", icon: "📋", color: "#0EA5E9" },
        { id: "task-2", name: "Estimate Effort", icon: "⏱️", color: "#10B981" },
        { id: "task-3", name: "Define Sprint Goals", icon: "🎯", color: "#8B5CF6" },
        { id: "task-4", name: "Create User Stories", icon: "📝", color: "#F59E0B" },
        { id: "task-5", name: "Prioritize Backlog", icon: "⬆️", color: "#EC4899" },
        { id: "task-6", name: "Assign Team Roles", icon: "👥", color: "#06B6D4" },
    ],
    "pm-development": [
        { id: "task-7", name: "Implement Feature", icon: "💻", color: "#0EA5E9" },
        { id: "task-8", name: "Code Review", icon: "👁️", color: "#10B981" },
        { id: "task-9", name: "Unit Test", icon: "🧪", color: "#8B5CF6" },
        { id: "task-10", name: "Integrate Modules", icon: "🔗", color: "#F59E0B" },
        { id: "task-11", name: "Fix Bugs", icon: "🐛", color: "#EC4899" },
        { id: "task-12", name: "Document Code", icon: "📚", color: "#06B6D4" },
    ],
    "pm-qa": [
        { id: "task-13", name: "Integration Test", icon: "🧩", color: "#0EA5E9" },
        { id: "task-14", name: "Regression Test", icon: "🔄", color: "#10B981" },
        { id: "task-15", name: "Performance Test", icon: "⚡", color: "#8B5CF6" },
        { id: "task-16", name: "Security Test", icon: "🔒", color: "#F59E0B" },
        { id: "task-17", name: "Bug Verification", icon: "✅", color: "#EC4899" },
        { id: "task-18", name: "Test Report", icon: "📊", color: "#06B6D4" },
    ],
    "pm-deployment": [
        { id: "task-19", name: "Deploy to Staging", icon: "🚀", color: "#0EA5E9" },
        { id: "task-20", name: "Verify Deployment", icon: "🔍", color: "#10B981" },
        { id: "task-21", name: "Release to Production", icon: "🏁", color: "#8B5CF6" },
        { id: "task-22", name: "Monitor Deployment", icon: "👀", color: "#F59E0B" },
        { id: "task-23", name: "Rollback if Needed", icon: "↩️", color: "#EC4899" },
        { id: "task-24", name: "Notify Stakeholders", icon: "📢", color: "#06B6D4" },
    ],
    "pm-reporting": [
        { id: "task-25", name: "Prepare Report", icon: "📈", color: "#0EA5E9" },
        { id: "task-26", name: "Review Metrics", icon: "📉", color: "#10B981" },
        { id: "task-27", name: "Update Dashboard", icon: "📱", color: "#8B5CF6" },
        { id: "task-28", name: "Share Insights", icon: "💡", color: "#F59E0B" },
        { id: "task-29", name: "Collect Feedback", icon: "🗣️", color: "#EC4899" },
        { id: "task-30", name: "Archive Reports", icon: "🗄️", color: "#06B6D4" },
    ],
    "pm-retrospective": [
        { id: "task-31", name: "Collect Feedback", icon: "🗣️", color: "#0EA5E9" },
        { id: "task-32", name: "Review Sprint Performance", icon: "📊", color: "#10B981" },
        { id: "task-33", name: "Identify Bottlenecks", icon: "🔍", color: "#8B5CF6" },
        { id: "task-34", name: "Define Improvements", icon: "✨", color: "#F59E0B" },
        { id: "task-35", name: "Plan Next Sprint", icon: "📅", color: "#EC4899" },
        { id: "task-36", name: "Team Retrospective Meeting", icon: "👥", color: "#06B6D4" },
    ],
};

export default function ProcessorSidebar({ onMobileDragStart }) {
    const currentFlowId = useFlowStore((s) => s.currentFlowId);
    const processors = processorsByFlow[currentFlowId] || [];
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [activeTouch, setActiveTouch] = useState(null);
    const [longPressActive, setLongPressActive] = useState(false);
    const touchTimerRef = useRef(null);
    const longPressThreshold = 500;
    const dragThreshold = 10;

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth < 768;
    const isTablet = windowWidth >= 768 && windowWidth < 1024;
    const isTouchDevice = isMobile || isTablet;

    const safeUpdateStyle = (element, styles) => {
        if (!element || !element.style) return;
        
        Object.keys(styles).forEach(key => {
            if (element.style[key] !== undefined) {
                element.style[key] = styles[key];
            }
        });
    };

    const handleLongPress = useCallback((touch, processor, element) => {
        setLongPressActive(true);
        
        safeUpdateStyle(element, {
            opacity: "0.7",
            boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.4)",
            transform: "scale(0.96)"
        });

        if (isTouchDevice && onMobileDragStart) {
            onMobileDragStart(processor, {
                clientX: touch.clientX,
                clientY: touch.clientY,
                isLongPress: true
            });
        }
    }, [isTouchDevice, onMobileDragStart]);

    const handleTouchStart = useCallback((event, processor) => {
        event.preventDefault();
        const touch = event.touches[0];
        const targetElement = event.currentTarget;
        
        setActiveTouch({
            id: touch.identifier,
            processor: processor,
            startX: touch.clientX,
            startY: touch.clientY,
            element: targetElement
        });

        safeUpdateStyle(targetElement, {
            opacity: "0.9",
            transform: "scale(0.99)"
        });

        touchTimerRef.current = setTimeout(() => {
            const currentTouch = {
                clientX: touch.clientX,
                clientY: touch.clientY
            };
            handleLongPress(currentTouch, processor, targetElement);
        }, longPressThreshold);

    }, [handleLongPress, longPressThreshold]);

    const handleTouchMove = useCallback((event) => {
        if (!activeTouch) return;
        
        const touch = Array.from(event.touches).find(t => t.identifier === activeTouch.id);
        if (!touch) return;

        const deltaX = Math.abs(touch.clientX - activeTouch.startX);
        const deltaY = Math.abs(touch.clientY - activeTouch.startY);

        if ((deltaX > dragThreshold || deltaY > dragThreshold) && touchTimerRef.current) {
            clearTimeout(touchTimerRef.current);
            touchTimerRef.current = null;
            
            if (isTouchDevice && onMobileDragStart) {
                setLongPressActive(true);
                
                if (activeTouch.element) {
                    safeUpdateStyle(activeTouch.element, {
                        opacity: "0.5",
                        transform: "scale(0.95)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                    });
                }

                onMobileDragStart(activeTouch.processor, {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
            }
        }
    }, [activeTouch, isTouchDevice, onMobileDragStart, dragThreshold]);

    const handleTouchEnd = useCallback(() => {
        if (touchTimerRef.current) {
            clearTimeout(touchTimerRef.current);
            touchTimerRef.current = null;
        }

        if (activeTouch?.element) {
            safeUpdateStyle(activeTouch.element, {
                opacity: "1",
                transform: "scale(1)",
                boxShadow: "none"
            });
        }

        setLongPressActive(false);
        setActiveTouch(null);
    }, [activeTouch]);

    const handleDragStart = useCallback((event, processor) => {
        event.dataTransfer.setData(
            "application/reactflow",
            JSON.stringify({
                type: "processor",
                label: processor.name,
                color: processor.color,
                icon: processor.icon,
                id: processor.id
            })
        );
        event.dataTransfer.effectAllowed = "move";

        safeUpdateStyle(event.currentTarget, {
            opacity: "0.7"
        });
    }, []);

    const handleDragEnd = useCallback(() => {
        const processorCards = document.querySelectorAll('[data-processor-card]');
        processorCards.forEach(card => {
            safeUpdateStyle(card, {
                opacity: "1",
                transform: "scale(1)",
                boxShadow: "none"
            });
        });
    }, []);

    useEffect(() => {
        const handleGlobalTouchMove = (e) => {
            handleTouchMove(e);
        };

        const handleGlobalTouchEnd = () => {
            handleTouchEnd();
        };

        if (isTouchDevice) {
            document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
            document.addEventListener('touchend', handleGlobalTouchEnd);
            document.addEventListener('touchcancel', handleGlobalTouchEnd);
        }

        return () => {
            document.removeEventListener('touchmove', handleGlobalTouchMove);
            document.removeEventListener('touchend', handleGlobalTouchEnd);
            document.removeEventListener('touchcancel', handleGlobalTouchEnd);
            
            if (touchTimerRef.current) {
                clearTimeout(touchTimerRef.current);
            }
        };
    }, [isTouchDevice, handleTouchMove, handleTouchEnd]);

    const getFlowTitle = () => {
        const titles = {
            "pm-sprint": "Sprint Planning",
            "pm-development": "Development Phase",
            "pm-qa": "Quality Assurance",
            "pm-deployment": "Deployment Phase",
            "pm-reporting": "Reporting & Analytics",
            "pm-retrospective": "Retrospective",
        };
        return titles[currentFlowId] || "Project Tasks";
    };

    // Responsive Styles
    const sidebarStyle = {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #f0fdfa 0%, #e0f2fe 100%)",
        borderRight: "1px solid #d1d5db",
        boxSizing: "border-box",
        overflow: "hidden",
        minWidth: isMobile ? "280px" : "240px",
        userSelect: "none",
    };

    const headerStyle = {
        padding: isMobile ? "16px" : "20px",
        borderBottom: "1px solid #d1d5db",
        background: "white",
        flexShrink: 0,
    };

    const headerTopStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "8px",
    };

    const titleStyle = {
        fontSize: isMobile ? "16px" : "18px",
        fontWeight: "bold",
        color: "#1f2937",
        margin: 0,
    };

    const badgeStyle = {
        padding: "4px 12px",
        background: "#ccfbf1",
        color: "#0f766e",
        fontSize: isMobile ? "10px" : "12px",
        fontWeight: "600",
        borderRadius: "999px",
    };

    const subtitleStyle = {
        fontSize: isMobile ? "11px" : "12px",
        color: "#6b7280",
        margin: 0,
        lineHeight: "1.5",
    };

    const contentStyle = {
        flex: 1,
        overflowY: "auto",
        padding: isMobile ? "16px" : "20px",
        WebkitOverflowScrolling: "touch",
    };

    const taskGridStyle = {
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr",
        gap: isMobile ? "10px" : "12px",
    };

    const taskCardStyle = {
        position: "relative",
        cursor: isTouchDevice ? "pointer" : "grab",
        touchAction: "none",
        WebkitTapHighlightColor: "transparent",
    };

    const taskCardInnerStyle = {
        background: "white",
        borderRadius: "12px",
        border: "1px solid #d1fae5",
        padding: isMobile ? "12px" : "16px",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "flex-start",
        gap: isMobile ? "10px" : "12px",
        userSelect: "none",
    };

    const getTaskIconStyle = (processor) => ({
        width: isMobile ? "28px" : "32px",
        height: isMobile ? "28px" : "32px",
        borderRadius: "8px",
        background: `linear-gradient(135deg, ${processor.color}20 0%, ${processor.color}40 100%)`,
        border: `1px solid ${processor.color}30`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: isMobile ? "14px" : "16px",
    });

    const taskContentStyle = {
        flex: 1,
        minWidth: 0,
    };

    const taskNameStyle = {
        fontSize: isMobile ? "13px" : "14px",
        fontWeight: "600",
        color: "#1f2937",
        margin: "0 0 4px 0",
        lineHeight: "1.3",
    };

    const taskTagStyle = {
        fontSize: isMobile ? "9px" : "11px",
        padding: "2px 8px",
        background: "#f0fdfa",
        color: "#0f766e",
        borderRadius: "999px",
        display: "inline-block",
    };

    const taskDragIconStyle = {
        flexShrink: 0,
        color: "#9ca3af",
        transition: "color 0.2s ease",
        alignSelf: "center",
    };

    const footerStyle = {
        padding: isMobile ? "12px 16px" : "16px 20px",
        borderTop: "1px solid #d1d5db",
        background: "rgba(255, 255, 255, 0.8)",
        flexShrink: 0,
    };

    const footerTextStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        fontSize: isMobile ? "12px" : "14px",
        color: "#4b5563",
        margin: 0,
    };

    const emptyStateStyle = {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "linear-gradient(180deg, #f0fdfa 0%, #e0f2fe 100%)",
        textAlign: "center",
    };

    const emptyIconStyle = {
        width: "48px",
        height: "48px",
        marginBottom: "16px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #ccfbf1 0%, #bae6fd 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

    if (processors.length === 0) {
        return (
            <div style={emptyStateStyle}>
                <div style={emptyIconStyle}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2">
                        <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937", margin: "0 0 4px" }}>
                    No Tasks Available
                </h3>
                <p style={{ fontSize: "12px", color: "#6b7280" }}>Select a flow type from dashboard</p>
            </div>
        );
    }

    return (
        <div style={sidebarStyle} data-mobile-sidebar>
            {/* Header */}
            <div style={headerStyle}>
                <div style={headerTopStyle}>
                    <h3 style={titleStyle}>{getFlowTitle()}</h3>
                    <span style={badgeStyle}>{processors.length} tasks</span>
                </div>
                <p style={subtitleStyle}>
                    {isTouchDevice 
                        ? "Long press & drag tasks to canvas" 
                        : "Drag tasks to the canvas to build your workflow"
                    }
                </p>
            </div>

            {/* Task List */}
            <div style={contentStyle}>
                <div style={taskGridStyle}>
                    {processors.map((proc) => (
                        <div
                            key={proc.id}
                            draggable={!isTouchDevice}
                            onDragStart={(event) => handleDragStart(event, proc)}
                            onDragEnd={handleDragEnd}
                            onTouchStart={(event) => handleTouchStart(event, proc)}
                            onTouchEnd={handleTouchEnd}
                            onTouchCancel={handleTouchEnd}
                            style={taskCardStyle}
                            data-processor-card
                            data-processor-id={proc.id}
                            data-touch-device={isTouchDevice}
                        >
                            <div style={taskCardInnerStyle}>
                                <div style={getTaskIconStyle(proc)}>
                                    {proc.icon}
                                </div>
                                <div style={taskContentStyle}>
                                    <h4 style={taskNameStyle}>{proc.name}</h4>
                                    <div>
                                        <span style={taskTagStyle}>
                                            {isTouchDevice ? "Long press to drag" : "Drag me"}
                                        </span>
                                    </div>
                                </div>
                                <div style={taskDragIconStyle}>
                                    <svg
                                        width={isMobile ? "14" : "16"}
                                        height={isMobile ? "14" : "16"}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M4 8h16M4 16h16" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {isTouchDevice && (
                    <div style={{
                        padding: "12px",
                        backgroundColor: "#FEF3C7",
                        border: "1px solid #FDE68A",
                        borderRadius: "8px",
                        marginTop: "16px",
                        textAlign: "center",
                        fontSize: "12px",
                        color: "#92400E",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 19V5M5 12h14" />
                            </svg>
                            <span>
                                <strong>How to drag:</strong> Long press (500ms) on any task, then drag to canvas
                            </span>
                        </div>
                        <div style={{ fontSize: "10px", marginTop: "4px", opacity: 0.8 }}>
                            Release anywhere on canvas to drop
                        </div>
                    </div>
                )}

                {longPressActive && isTouchDevice && (
                    <div style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "rgba(14, 165, 233, 0.9)",
                        color: "white",
                        padding: "12px 20px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontWeight: "600",
                        zIndex: 1000,
                        pointerEvents: "none",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                        animation: "pulse 1.5s infinite",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 8h16M4 16h16" />
                            </svg>
                            Dragging to canvas...
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={footerStyle}>
                <p style={footerTextStyle}>
                    <svg
                        width={isMobile ? "14" : "16"}
                        height={isMobile ? "14" : "16"}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0d9488"
                        strokeWidth="2"
                    >
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {isTouchDevice 
                        ? "Long press & drag to canvas" 
                        : "Drag tasks to the canvas"
                    }
                </p>
            </div>

            <style>
                {`
                    @keyframes pulse {
                        0% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.98); }
                        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.02); }
                        100% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.98); }
                    }
                `}
            </style>
        </div>
    );
}