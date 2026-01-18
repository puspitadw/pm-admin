import React from "react";

const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
};

const dialogStyle = {
    background: "#ffffff",
    borderRadius: 8,
    padding: 20,
    width: 360,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
};

export default function ConnectionDialog({
    open,
    onClose,
    onConfirm,
}) {
    if (!open) return null;

    return (
        <div style={overlayStyle}>
            <div style={dialogStyle}>
                <h3 style={{
                    marginTop: 0,
                    marginBottom: 24,
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#0f766e",
                    borderBottom: "2px solid #14b8a6",
                    paddingBottom: 12
                }}>
                    Create Connection
                </h3>

                <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 16,
                    padding: 12,
                    background: "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)",
                    borderRadius: 8,
                    border: "1px solid #99f6e4",
                    cursor: "pointer"
                }}>
                    <input
                        type="radio"
                        checked
                        readOnly
                        style={{
                            accentColor: "#14b8a6",
                            width: 18,
                            height: 18,
                            cursor: "pointer"
                        }}
                    />
                    <span style={{
                        color: "#0f766e",
                        fontWeight: "500",
                        fontSize: "0.9rem"
                    }}>
                        success
                    </span>
                </label>

                <div
                    style={{
                        marginTop: 28,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 12,
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            background: "white",
                            color: "#64748b",
                            padding: "0.625rem 1.25rem",
                            borderRadius: "0.5rem",
                            border: "1px solid #d1d5db",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            transition: "all 0.3s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#f8fafc";
                            e.currentTarget.style.borderColor = "#94a3b8";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "white";
                            e.currentTarget.style.borderColor = "#d1d5db";
                        }}
                    >
                        Close
                    </button>
                    <button
                        onClick={() => onConfirm("success")}
                        style={{
                            background: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
                            color: "white",
                            padding: "0.625rem 1.25rem",
                            borderRadius: "0.5rem",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            transition: "all 0.3s",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 4px 8px rgba(20, 184, 166, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
                        }}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}