import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFlowStore } from '../store/useFlowStore';
import { validatePublishFlow } from '../utils/publishValidation';
import { ValidationNotification } from './ValidNotification';

export default function PublishModal({ onClose }) {
    const [validated, setValidated] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [notification, setNotification] = useState(null);
    const [publishSuccess, setPublishSuccess] = useState(false);
    const [redirectCountdown, setRedirectCountdown] = useState(3); // PERBAIKAN: Tambah countdown

    const currentFlowId = useFlowStore(state => state.currentFlowId);
    const nodes = useFlowStore(state => state.flows[currentFlowId]?.nodes ?? []);
    const edges = useFlowStore(state => state.flows[currentFlowId]?.edges ?? []);
    const navigate = useNavigate();

    // PERBAIKAN: Handle countdown untuk redirect
    useEffect(() => {
        if (publishSuccess && redirectCountdown > 0) {
            const timer = setTimeout(() => {
                setRedirectCountdown(redirectCountdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (publishSuccess && redirectCountdown === 0) {
            // Redirect setelah countdown selesai
            onClose();
            navigate("/dashboard");
        }
    }, [publishSuccess, redirectCountdown, navigate, onClose]);

    const handleValidate = () => {
        const validation = validatePublishFlow(nodes, edges);

        if (validation.status === 'VALID') {
            setValidated(true);
            setNotification({
                message: validation.message,
                type: validation.type,
            });
        } else {
            setNotification({
                message: validation.message,
                type: validation.type,
            });
        }
    };

    // PERBAIKAN: Fungsi publish yang lebih baik
    const handlePublish = async () => {
        setIsPublishing(true);

        try {
            // 1. Siapkan payload JSON lengkap
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

            console.log("Publishing payload:", publishPayload);

            // 2. Simulasi API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 3. Simulasi response sukses
            const mockResponse = {
                success: true,
                message: "Design published successfully!",
                publishedId: `PUB_${Date.now()}`,
                timestamp: new Date().toISOString()
            };

            // 4. Tampilkan notifikasi sukses dan mulai countdown
            setIsPublishing(false);
            setPublishSuccess(true);
            setNotification({
                message: mockResponse.message,
                type: "success",
            });

            // PERBAIKAN: Tidak perlu setTimeout tambahan, sudah dihandle oleh useEffect

        } catch (error) {
            // Handle error
            setIsPublishing(false);
            setNotification({
                message: "Failed to publish design. Please try again.",
                type: "error",
            });
            console.error("Publish error:", error);
        }
    };

    const closeNotification = () => {
        setNotification(null);
    };

    const getPayloadPreview = () => {
        return JSON.stringify({
            flowId: currentFlowId,
            processors: nodes.map(n => ({
                id: n.id,
                label: n.data?.label || n.label,
                type: n.type
            })),
            connections: edges.map(e => ({
                id: e.id,
                source: e.source,
                target: e.target,
                type: e.type
            })),
            summary: {
                processorCount: nodes.length,
                connectionCount: edges.length,
                validationStatus: validated ? "VALID" : "PENDING"
            },
            timestamp: new Date().toISOString()
        }, null, 2);
    };

    // Styles - Perbaikan style untuk success state
    const overlayStyle = {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
    };

    const modalStyle = {
        backgroundColor: "white",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "520px",
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        border: "1px solid #E5E7EB",
    };

    const headerStyle = {
        padding: "24px 24px 16px 24px",
        borderBottom: "1px solid #F3F4F6",
        background: publishSuccess
            ? "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)"
            : "linear-gradient(135deg, #F0FDFA 0%, #E0F2FE 100%)",
    };

    const titleStyle = {
        fontSize: "20px",
        fontWeight: "600",
        color: publishSuccess ? "#065F46" : "#0F766E",
        margin: "0 0 8px 0",
        display: "flex",
        alignItems: "center",
        gap: "12px",
    };

    const subtitleStyle = {
        fontSize: "14px",
        color: publishSuccess ? "#047857" : "#6B7280",
        margin: 0,
        lineHeight: "1.5",
    };

    const contentStyle = {
        padding: "24px",
        maxHeight: "60vh",
        overflowY: "auto",
    };

    const successMessageStyle = {
        backgroundColor: "#D1FAE5",
        border: "1px solid #A7F3D0",
        borderRadius: "8px",
        padding: "24px",
        marginBottom: "16px",
        textAlign: "center",
    };

    const successIconStyle = {
        width: "64px",
        height: "64px",
        color: "#10B981",
        margin: "0 auto 16px",
    };

    const countdownStyle = {
        fontSize: "14px",
        color: "#047857",
        fontWeight: "500",
        marginTop: "12px",
    };

    const footerStyle = {
        padding: "16px 24px 24px 24px",
        borderTop: "1px solid #F3F4F6",
        display: "flex",
        gap: "12px",
    };

    const primaryButtonStyle = (disabled) => ({
        flex: 1,
        padding: "12px 20px",
        background: disabled
            ? "#9CA3AF"
            : publishSuccess
                ? "#10B981"
                : "linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        opacity: disabled ? 0.6 : 1,
    });

    const secondaryButtonStyle = {
        flex: 1,
        padding: "12px 20px",
        backgroundColor: "white",
        color: "#6B7280",
        border: "1px solid #D1D5DB",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
    };

    // PERBAIKAN: Manual redirect button untuk fallback
    const handleManualRedirect = () => {
        onClose();
        navigate("/dashboard");
    };

    return (
        <>
            {/* Overlay */}
            <div style={overlayStyle} onClick={onClose}>
                <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div style={headerStyle}>
                        <h2 style={titleStyle}>
                            {publishSuccess ? (
                                <>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Publish Successful!
                                </>
                            ) : (
                                <>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    Publish Design Flow
                                </>
                            )}
                        </h2>
                        <p style={subtitleStyle}>
                            {publishSuccess
                                ? "Your flow has been published successfully"
                                : "Review and publish your workflow design"
                            }
                        </p>
                    </div>

                    {/* Content */}
                    <div style={contentStyle}>
                        {publishSuccess ? (
                            <div style={successMessageStyle}>
                                <div style={successIconStyle}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 style={{ margin: "0 0 12px", color: "#065F46", fontSize: "18px" }}>
                                    Design Published Successfully!
                                </h3>
                                <p style={{ margin: 0, color: "#047857", fontSize: "14px", lineHeight: "1.5" }}>
                                    Your workflow is now live and available in production.
                                </p>

                                {/* PERBAIKAN: Tampilkan countdown */}
                                <div style={countdownStyle}>
                                    Redirecting to dashboard in {redirectCountdown} second{redirectCountdown !== 1 ? 's' : ''}...
                                </div>

                                {/* PERBAIKAN: Manual redirect button */}
                                <button
                                    onClick={handleManualRedirect}
                                    style={{
                                        marginTop: "20px",
                                        padding: "10px 20px",
                                        backgroundColor: "#10B981",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "#0D9488";
                                        e.currentTarget.style.transform = "translateY(-1px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "#10B981";
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    Go to Dashboard Now
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Flow Information */}
                                <div style={{
                                    backgroundColor: "#F0F9FF",
                                    borderRadius: "8px",
                                    padding: "16px",
                                    marginBottom: "24px",
                                    border: "1px solid #BAE6FD",
                                }}>
                                    <p style={{ fontSize: "14px", color: "#374151", margin: "0 0 8px 0" }}>
                                        Flow ID: <span style={{
                                            fontSize: "13px",
                                            fontWeight: "500",
                                            color: "#0369A1",
                                            fontFamily: "monospace",
                                            backgroundColor: "white",
                                            padding: "4px 8px",
                                            borderRadius: "4px",
                                            display: "inline-block",
                                            border: "1px solid #BAE6FD",
                                        }}>{currentFlowId}</span>
                                    </p>
                                    <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
                                        This will publish the current design to production
                                    </p>
                                </div>

                                {/* Stats */}
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "16px",
                                    marginBottom: "24px",
                                }}>
                                    <div style={{
                                        backgroundColor: "#F9FAFB",
                                        borderRadius: "8px",
                                        padding: "16px",
                                        border: "1px solid #E5E7EB",
                                    }}>
                                        <div style={{
                                            fontSize: "24px",
                                            fontWeight: "600",
                                            color: "#1F2937",
                                            margin: "0 0 4px 0",
                                        }}>{nodes.length}</div>
                                        <div style={{
                                            fontSize: "12px",
                                            color: "#6B7280",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em",
                                            fontWeight: "500",
                                            margin: 0,
                                        }}>Processors</div>
                                    </div>
                                    <div style={{
                                        backgroundColor: "#F9FAFB",
                                        borderRadius: "8px",
                                        padding: "16px",
                                        border: "1px solid #E5E7EB",
                                    }}>
                                        <div style={{
                                            fontSize: "24px",
                                            fontWeight: "600",
                                            color: "#1F2937",
                                            margin: "0 0 4px 0",
                                        }}>{edges.length}</div>
                                        <div style={{
                                            fontSize: "12px",
                                            color: "#6B7280",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em",
                                            fontWeight: "500",
                                            margin: 0,
                                        }}>Connections</div>
                                    </div>
                                </div>

                                {/* Validation Status */}
                                {validated && (
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "12px 16px",
                                        backgroundColor: "#D1FAE5",
                                        borderRadius: "8px",
                                        marginBottom: "16px",
                                        border: "1px solid #A7F3D0",
                                    }}>
                                        <div style={{
                                            width: "16px",
                                            height: "16px",
                                            color: "#059669",
                                        }}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p style={{
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            color: "#065F46",
                                            margin: 0,
                                        }}>
                                            All processors are properly connected and ready to publish
                                        </p>
                                    </div>
                                )}

                                {/* Payload Preview */}
                                {validated && (
                                    <div>
                                        <p style={{ fontSize: "13px", fontWeight: "500", color: "#374151", margin: "0 0 8px 0" }}>
                                            Payload to be sent to backend:
                                        </p>
                                        <div style={{
                                            fontSize: "11px",
                                            color: "#6B7280",
                                            backgroundColor: "#F9FAFB",
                                            padding: "12px",
                                            borderRadius: "6px",
                                            fontFamily: "'Courier New', monospace",
                                            marginTop: "16px",
                                            border: "1px solid #E5E7EB",
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                            lineHeight: "1.4",
                                        }}>
                                            {getPayloadPreview()}
                                        </div>
                                        <p style={{ fontSize: "11px", color: "#6B7280", margin: "8px 0 0", fontStyle: "italic" }}>
                                            * This JSON will be sent to backend API endpoint
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div style={footerStyle}>
                        {publishSuccess ? (
                            <button
                                onClick={handleManualRedirect}
                                style={primaryButtonStyle(false)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(16, 185, 129, 0.3)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Go to Dashboard Now
                            </button>
                        ) : !validated ? (
                            <>
                                <button
                                    onClick={handleValidate}
                                    style={primaryButtonStyle(false)}
                                    onMouseEnter={(e) => {
                                        if (!isPublishing) {
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                            e.currentTarget.style.boxShadow = "0 8px 16px rgba(15, 118, 110, 0.3)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Validate Design
                                </button>
                                <button
                                    onClick={onClose}
                                    style={secondaryButtonStyle}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.backgroundColor = "#F9FAFB";
                                        e.currentTarget.borderColor = "#9CA3AF";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.backgroundColor = "white";
                                        e.currentTarget.borderColor = "#D1D5DB";
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handlePublish}
                                    disabled={isPublishing}
                                    style={primaryButtonStyle(isPublishing)}
                                    onMouseEnter={(e) => {
                                        if (!isPublishing) {
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                            e.currentTarget.style.boxShadow = "0 8px 16px rgba(15, 118, 110, 0.3)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    {isPublishing ? (
                                        <>
                                            <svg
                                                style={{
                                                    width: "16px",
                                                    height: "16px",
                                                    animation: "spin 1s linear infinite"
                                                }}
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                                            </svg>
                                            Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                            </svg>
                                            Publish Now
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setValidated(false)}
                                    style={secondaryButtonStyle}
                                    disabled={isPublishing}
                                    onMouseEnter={(e) => {
                                        if (!isPublishing) {
                                            e.currentTarget.backgroundColor = "#F9FAFB";
                                            e.currentTarget.borderColor = "#9CA3AF";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isPublishing) {
                                            e.currentTarget.backgroundColor = "white";
                                            e.currentTarget.borderColor = "#D1D5DB";
                                        }
                                    }}
                                >
                                    Back
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Notifications */}
            {notification && (
                <ValidationNotification
                    message={notification.message}
                    type={notification.type}
                    onClose={closeNotification}
                />
            )}

            {/* Spinner Animation CSS */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}