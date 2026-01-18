import React, { useState } from "react";
import { useFlowStore } from "../store/useFlowStore";
import { validatePublishFlow } from "../utils/publishValidation";
import { useValidationNotification } from "../utils/useValidtionNotif";
import { Button } from "@heroui/react";

export default function PublishButton({ onValid }) {
    const currentFlowId = useFlowStore((s) => s.currentFlowId);
    const nodes = useFlowStore((s) => s.flows[currentFlowId]?.nodes ?? []);
    const edges = useFlowStore((s) => s.flows[currentFlowId]?.edges ?? []);
    const [isLoading, setIsLoading] = useState(false);

    const {
        showNotification,
        NotificationComponent
    } = useValidationNotification(); 

    const handlePublish = () => {
        const validation = validatePublishFlow(nodes, edges);

        if (validation.status === 'VALID') {
            setIsLoading(true);
            
            setTimeout(() => {
                setIsLoading(false);
                onValid();  
            }, 1000);
        } else {
            showNotification(validation);
        }
    };

    const buttonStyle = {
        padding: "10px 20px",
        background: "linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        minWidth: "120px",
        justifyContent: "center",
    };

    return (
        <>
            <Button
                onPress={handlePublish}
                isDisabled={isLoading}
                style={{
                    ...buttonStyle,
                    opacity: isLoading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                    if (!isLoading) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                            "0 8px 16px rgba(15, 118, 110, 0.3)";
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                }}
            >
                {isLoading ? (
                    <>
                        <svg
                            style={{
                                width: "16px",
                                height: "16px",
                                animation: "spin 1s linear infinite",
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
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        Publish Flow
                    </>
                )}
            </Button>

            {/* Notification akan muncul di sini */}
            {NotificationComponent}

            {/* Add CSS for spinner */}
            <style>{`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `}</style>
        </>
    );
}