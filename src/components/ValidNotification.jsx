import React, { useState, useEffect } from "react";

export function ValidationNotification({ message, type = "warning", onClose, duration = 5000 }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    useEffect(() => {
        if (!isVisible) {
            const timer = setTimeout(() => onClose?.(), 300);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    const notificationStyle = {
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 10000,
        minWidth: "320px",
        maxWidth: "400px",
        backgroundColor: type === "error" ? "#FEF2F2" :
            type === "success" ? "#F0FDF4" :
                "#FFFBEB",
        border: `1px solid ${type === "error" ? "#FECACA" :
            type === "success" ? "#BBF7D0" :
                "#FDE68A"}`,
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        transform: isVisible ? "translateX(0)" : "translateX(100%)",
        opacity: isVisible ? 1 : 0,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    };

    const iconStyle = {
        width: "20px",
        height: "20px",
        flexShrink: 0,
        color: type === "error" ? "#DC2626" :
            type === "success" ? "#16A34A" :
                "#D97706",
    };

    const contentStyle = {
        flex: 1,
    };

    const titleStyle = {
        fontSize: "14px",
        fontWeight: "600",
        color: type === "error" ? "#991B1B" :
            type === "success" ? "#166534" :
                "#92400E",
        margin: "0 0 4px 0",
    };

    const messageStyle = {
        fontSize: "13px",
        color: type === "error" ? "#B91C1C" :
            type === "success" ? "#15803D" :
                "#B45309",
        lineHeight: "1.4",
        margin: 0,
    };

    const closeButtonStyle = {
        background: "transparent",
        border: "none",
        padding: "4px",
        cursor: "pointer",
        color: "#6B7280",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "6px",
        transition: "all 0.2s ease",
        flexShrink: 0,
    };

    const buttonContainerStyle = {
        marginTop: "12px",
        display: "flex",
        justifyContent: "flex-end",
    };

    const actionButtonStyle = {
        padding: "6px 16px",
        backgroundColor: type === "error" ? "#DC2626" :
            type === "success" ? "#16A34A" :
                "#D97706",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "13px",
        fontWeight: "500",
        cursor: "pointer",
        transition: "all 0.2s ease",
    };

    const getIcon = () => {
        if (type === "error") {
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        }
        if (type === "success") {
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        }
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
        );
    };

    const getTitle = () => {
        if (type === "error") return "Error";
        if (type === "success") return "Success";
        return "Validation Required";
    };

    return (
        <div style={notificationStyle}>
            <div style={iconStyle}>
                {getIcon()}
            </div>

            <div style={contentStyle}>
                <h4 style={titleStyle}>{getTitle()}</h4>
                <p style={messageStyle}>{message}</p>

                <div style={buttonContainerStyle}>
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(() => onClose?.(), 300);
                        }}
                        style={actionButtonStyle}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        OK
                    </button>
                </div>
            </div>

            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => onClose?.(), 300);
                }}
                style={closeButtonStyle}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F3F4F6";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}