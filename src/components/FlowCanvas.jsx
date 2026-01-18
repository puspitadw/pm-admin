import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import ReactFlow, { useReactFlow, Panel, Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import { useFlowStore } from "../store/useFlowStore";
import ProcessorNode from "../nodes/ProcessorNode";
import ConnectionDialog from "./ConnectionDialog";
import PublishButton from './PublishButton';
import PublishModal from './PublishModal';

export default function FlowCanvas({ setShowPublishModal }) {
    const currentFlowId = useFlowStore((s) => s.currentFlowId);
    const nodes = useFlowStore((s) => s.flows[s.currentFlowId]?.nodes ?? []);
    const edges = useFlowStore((s) => s.flows[s.currentFlowId]?.edges ?? []);
    const addNode = useFlowStore((s) => s.addNode);
    const storeOnConnect = useFlowStore((s) => s.onConnect);
    const onNodesChange = useFlowStore((s) => s.onNodesChange);
    const onEdgesChange = useFlowStore((s) => s.onEdgesChange);
    const removeNodeById = useFlowStore((s) => s.removeNodeById);
    const updateNodePosition = useFlowStore((s) => s.updateNodePosition);
    const reactFlowInstance = useReactFlow();
    const wrapperRef = useRef(null);
    const NODE_WIDTH = 180;
    const NODE_HEIGHT = 60;
    const [pendingConnection, setPendingConnection] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [openPublish, setOpenPublish] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
    const [connectionError, setConnectionError] = useState(null);
    const [lastTappedEdgeId, setLastTappedEdgeId] = useState(null);

    const nodeTypes = useMemo(() => ({
        processor: ProcessorNode
    }), []);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === "Delete") {
                const selectedNode = nodes.find((n) => n.selected);
                if (selectedNode) {
                    removeNodeById(selectedNode.id);
                }

                const selectedEdge = edges.find((e) => e.selected);
                if (selectedEdge) {
                    storeOnConnect({
                        ...selectedEdge,
                        deleted: true,
                    });
                }
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [nodes, edges, removeNodeById, storeOnConnect]);

    const handleConnect = useCallback((connection) => {
        const { source, target } = connection;

        if (source === target) {
            setConnectionError("Cannot connect processor to itself");
            setTimeout(() => setConnectionError(null), 3000);
            return;
        }

        if (!source || !target) {
            setConnectionError("Please connect to valid connection points");
            setTimeout(() => setConnectionError(null), 3000);
            return;
        }

        setPendingConnection(connection);
        setIsDialogOpen(true);
        setConnectionError(null);
    }, []);

    const handlePaneClick = useCallback(() => {
        setLastTappedEdgeId(null);
    }, []);


    const handleEdgeClick = useCallback((event, edge) => {
        event.stopPropagation();
        setLastTappedEdgeId(edge.id);
        // unselect semua node
        onNodesChange(
            nodes.map((n) => ({
                id: n.id,
                type: "select",
                selected: false,
            }))
        );

        onEdgesChange([
            {
                id: edge.id,
                type: "select",
                selected: true,
            },
        ]);
    }, [nodes, onNodesChange, onEdgesChange]);



    const confirmConnection = (relationship) => {
        if (!pendingConnection) return;

        storeOnConnect({
            ...pendingConnection,
            label: relationship,
            type: "smoothstep",
            animated: true,
            style: {
                stroke: "#0078D4",
                strokeWidth: 2,
                strokeDasharray: relationship === "priority" ? "5,5" : "none",
            },
            labelStyle: {
                fill: "#0078D4",
                fontSize: 11,
                fontWeight: 600,
                background: "#FFFFFF",
                padding: "4px 8px",
                borderRadius: "4px",
                border: "1px solid #E5E7EB",
            },
        });

        setPendingConnection(null);
        setIsDialogOpen(false);
    };

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            const data = event.dataTransfer.getData("application/reactflow");
            if (!data) return;

            const { label } = JSON.parse(data);
            const flowPosition = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const position = {
                x: flowPosition.x - NODE_WIDTH / 2,
                y: flowPosition.y - NODE_HEIGHT / 2,
            };
            addNode(position, label);
        },
        [reactFlowInstance, addNode]
    );

    const handleZoom = useCallback((transform) => {
        setZoomLevel(transform.zoom);
    }, []);

    const handleNodeDragStop = useCallback((event, node) => {
        updateNodePosition(node.id, node.position);
        console.log('✅ Node position saved:', node.id, node.position);
    }, [updateNodePosition]);

    const handleDeleteSelected = useCallback(() => {
        const selectedNodes = nodes.filter((n) => n.selected);
        if (selectedNodes.length > 0) {
            onNodesChange(
                selectedNodes.map((n) => ({
                    id: n.id,
                    type: "remove",
                }))
            );
        }

        if (lastTappedEdgeId) {
            onEdgesChange([
                {
                    id: lastTappedEdgeId,
                    type: "remove",
                },
            ]);
            setLastTappedEdgeId(null);
            return;
        }

        const selectedEdges = edges.filter((e) => e.selected);
        if (selectedEdges.length > 0) {
            onEdgesChange(
                selectedEdges.map((e) => ({
                    id: e.id,
                    type: "remove",
                }))
            );
        }
    }, [nodes, edges, lastTappedEdgeId, onNodesChange, onEdgesChange]);


    const handleDesktopPublish = useCallback(() => {
        if (isMobile || isTablet) {
            if (setShowPublishModal) {
                setShowPublishModal(true);
            } else {
                setOpenPublish(true);
            }
        } else {
            setOpenPublish(true);
        }
    }, [setShowPublishModal, isMobile, isTablet]);

    const reactFlowProps = useMemo(() => ({
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect: handleConnect,
        onEdgeClick: handleEdgeClick,
        onPaneClick: handlePaneClick,
        onMove: (_event, viewport) => handleZoom(viewport),
        onNodeDragStop: handleNodeDragStop,
        nodeTypes: nodeTypes,
        connectionLineType: "smoothstep",
        connectionLineStyle: {
            stroke: "#0078D4",
            strokeWidth: 2,
        },
        snapToGrid: true,
        snapGrid: [20, 20],
        fitView: true,
        minZoom: 0.2,
        maxZoom: 2,
        defaultViewport: { x: 100, y: 100, zoom: 1 },

        panOnDrag: isMobile || isTablet ? [0] : [1, 2],
        panOnScroll: false,
        zoomOnScroll: isMobile || isTablet ? false : true,
        zoomOnPinch: true,
        zoomOnDoubleClick: true,
        elementsSelectable: true,
        nodesConnectable: true,
        nodesDraggable: true,
        selectionOnDrag: true,
        selectionKeyCode: null,
        multiSelectionKeyCode: null,
        connectionRadius: 30,
    }), [
        nodes, edges, onNodesChange, onEdgesChange, handleConnect, handleEdgeClick,
        handlePaneClick, handleZoom, handleNodeDragStop, nodeTypes, isMobile, isTablet
    ]);

    const desktopPublishButtonStyle = {
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

    const containerStyle = {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        backgroundColor: "#F8F9FA",
    };

    const headerStyle = {
        padding: isMobile ? "8px 12px" : "12px 20px",
        borderBottom: "1px solid #E1E4E8",
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)",
        boxShadow: isMobile ? "0 1px 2px rgba(0, 0, 0, 0.05)" : "0 2px 4px rgba(0, 0, 0, 0.05)",
        display: (isMobile || isTablet) ? "none" : "block",
    };

    const headerContentStyle = {
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: isMobile ? "8px" : "12px",
        width: "100%",
    };

    const headerLeftStyle = {
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        gap: isMobile ? "8px" : "16px",
        width: isMobile ? "100%" : "auto",
    };

    const headerTitleStyle = {
        fontSize: isMobile ? "14px" : "16px",
        fontWeight: "600",
        color: "#24292E",
        margin: 0,
        marginBottom: isMobile ? "4px" : "0",
    };

    const flowStatsStyle = {
        display: "flex",
        alignItems: "center",
        gap: isMobile ? "8px" : "12px",
        fontSize: isMobile ? "11px" : "13px",
        color: "#6A737D",
        flexWrap: "wrap",
        minWidth: isMobile ? "120px" : "150px",
    };

    const statItemStyle = {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        whiteSpace: "nowrap",
    };

    const statDotStyle = (color) => ({
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        backgroundColor: color,
        flexShrink: 0,
    });

    const headerRightStyle = {
        display: "flex",
        alignItems: "center",
        gap: isMobile ? "8px" : "12px",
        width: isMobile ? "100%" : "auto",
        justifyContent: isMobile ? "space-between" : "flex-end",
    };

    const zoomIndicatorStyle = {
        padding: isMobile ? "4px 8px" : "6px 12px",
        backgroundColor: "#FFFFFF",
        border: "1px solid #D1D5DA",
        borderRadius: "6px",
        fontSize: isMobile ? "10px" : "12px",
        color: "#24292E",
        fontWeight: "500",
        minWidth: isMobile ? "60px" : "80px",
        textAlign: "center",
    };

    const canvasContainerStyle = {
        flex: 1,
        position: "relative",
        backgroundColor: "#FFFFFF",
        backgroundImage: (isMobile || isTablet) ? "none" : `
            linear-gradient(90deg, #F1F3F5 1px, transparent 1px),
            linear-gradient(0deg, #F1F3F5 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
        backgroundPosition: "-1px -1px",
        overflow: "hidden",
        touchAction: "none", 
        WebkitTapHighlightColor: "transparent", 
    };

    const dropHintStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        zIndex: 1,
        pointerEvents: "none",
        width: isMobile ? "90%" : "auto",
    };

    const dropHintContentStyle = {
        padding: isMobile ? "16px" : "24px 32px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "12px",
        border: "2px dashed #D0D7DE",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    };

    const dropHintIconStyle = {
        width: isMobile ? "36px" : "48px",
        height: isMobile ? "36px" : "48px",
        margin: "0 auto 16px",
        color: "#6A737D",
    };

    const dropHintTextStyle = {
        fontSize: isMobile ? "14px" : "16px",
        color: "#24292E",
        fontWeight: "500",
        margin: "0 0 4px 0",
    };

    const dropHintSubtextStyle = {
        fontSize: isMobile ? "11px" : "12px",
        color: "#6A737D",
        margin: 0,
        lineHeight: "1.4",
    };

    const controlsPanelStyle = {
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #E1E4E8",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
    };

    const panelHeaderStyle = {
        padding: "12px 16px",
        borderBottom: "1px solid #F1F3F5",
        backgroundColor: "#FAFBFC",
    };

    const panelTitleStyle = {
        fontSize: "13px",
        fontWeight: "600",
        color: "#24292E",
        margin: 0,
    };

    const panelContentStyle = {
        padding: "16px",
    };

    const panelStatsStyle = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
    };

    const panelStatItemStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    };

    const panelStatValueStyle = {
        fontSize: "18px",
        fontWeight: "600",
        color: "#24292E",
    };

    const panelStatLabelStyle = {
        fontSize: "11px",
        color: "#6A737D",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    };

    const noFlowStyle = {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F8F9FA",
        backgroundImage: `
            linear-gradient(90deg, #EDF2F7 1px, transparent 1px),
            linear-gradient(0deg, #EDF2F7 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
    };

    const noFlowContentStyle = {
        textAlign: "center",
        padding: "40px",
        maxWidth: "400px",
        backgroundColor: "white",
        borderRadius: "12px",
        border: "1px solid #E1E4E8",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    };

    const noFlowIconStyle = {
        width: "64px",
        height: "64px",
        margin: "0 auto 20px",
        color: "#6A737D",
    };

    const footerBarStyle = {
        padding: isMobile ? "4px 12px" : "8px 20px",
        borderTop: "1px solid #E1E4E8",
        backgroundColor: "#FAFBFC",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: isMobile ? "10px" : "12px",
        color: "#6A737D",
        flexWrap: "wrap",
        gap: isMobile ? "8px" : "0",
    };

    if (!currentFlowId) {
        return (
            <div style={noFlowStyle}>
                <div style={noFlowContentStyle}>
                    <div style={noFlowIconStyle}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#24292E", margin: "0 0 8px" }}>
                        No Flow Selected
                    </h3>
                    <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: "1.5", marginBottom: "20px" }}>
                        Please select a flow from the dashboard to start designing.
                    </p>
                    <button
                        onClick={() => window.location.href = "/dashboard"}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#0078D4",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#106EBE";
                            e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#0078D4";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            {/* Header - Hidden on mobile & tablet */}
            {!(isMobile || isTablet) && (
                <div style={headerStyle}>
                    <div style={headerContentStyle}>
                        <div style={headerLeftStyle}>
                            <h2 style={headerTitleStyle}>Flow Designer</h2>
                            <div style={flowStatsStyle}>
                                <div style={statItemStyle}>
                                    <div style={statDotStyle("#0078D4")} />
                                    <span>Processors: {nodes.length}</span>
                                </div>
                                <div style={statItemStyle}>
                                    <div style={statDotStyle("#16C60C")} />
                                    <span>Connections: {edges.length}</span>
                                </div>
                            </div>
                        </div>
                        <div style={headerRightStyle}>
                            <div style={zoomIndicatorStyle}>
                                {Math.round(zoomLevel * 100)}%
                            </div>
                            <button
                                onClick={handleDesktopPublish}
                                style={desktopPublishButtonStyle}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(15, 118, 110, 0.3)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                Publish Flow
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Canvas Area */}
            <div
                ref={wrapperRef}
                style={canvasContainerStyle}
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <ReactFlow {...reactFlowProps}>
                    {/* Canvas Background */}
                    <Background
                        variant="dots"
                        gap={20}
                        size={1}
                        color="#D1D5DA"
                        style={{ backgroundColor: 'transparent' }}
                    />

                    {/* Controls - Hidden on mobile & tablet */}
                    {!(isMobile || isTablet) && (
                        <Controls
                            style={controlsPanelStyle}
                            showInteractive={false}
                        >
                            <div style={panelHeaderStyle}>
                                <h4 style={panelTitleStyle}>Canvas Controls</h4>
                            </div>
                        </Controls>
                    )}

                    {/* MiniMap - Hidden on mobile & tablet */}
                    {!(isMobile || isTablet) && (
                        <MiniMap
                            style={{
                                backgroundColor: "white",
                                border: "1px solid #E1E4E8",
                            }}
                            nodeStrokeColor={() => "#0078D4"}
                            nodeColor={() => "#E3F2FD"}
                            maskColor="rgba(240, 246, 252, 0.7)"
                        />
                    )}

                    {/* Stats Panel - Hidden on mobile & tablet */}
                    {!(isMobile || isTablet) && (
                        <Panel position="top-right" style={{ margin: "16px", right: "50px" }}>
                            <div style={controlsPanelStyle}>
                                <div style={panelHeaderStyle}>
                                    <h4 style={panelTitleStyle}>Flow Statistics</h4>
                                </div>
                                <div style={panelContentStyle}>
                                    <div style={panelStatsStyle}>
                                        <div style={panelStatItemStyle}>
                                            <div style={panelStatValueStyle}>{nodes.length}</div>
                                            <div style={panelStatLabelStyle}>Processors</div>
                                        </div>
                                        <div style={panelStatItemStyle}>
                                            <div style={panelStatValueStyle}>{edges.length}</div>
                                            <div style={panelStatLabelStyle}>Connections</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Panel>
                    )}
                </ReactFlow>

                {/* Tombol Hapus untuk Mobile & Tablet */}
                {(isMobile || isTablet) && (nodes.some(n => n.selected) || lastTappedEdgeId) && (
                    <button
                        onClick={handleDeleteSelected}
                        style={{
                            position: "absolute",
                            bottom: isMobile ? "72px" : "88px",
                            right: "20px",
                            padding: "12px 16px",
                            backgroundColor: "#DC2626",
                            color: "white",
                            border: "none",
                            borderRadius: "9999px",
                            fontSize: "14px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            boxShadow: "0 8px 20px rgba(220, 38, 38, 0.35)",
                            zIndex: 50,
                            cursor: "pointer",
                        }}
                    >
                        🗑 Hapus
                    </button>
                )}


                {/* Connection Error Display */}
                {connectionError && (
                    <div style={{
                        position: "absolute",
                        top: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#FEF2F2",
                        color: "#DC2626",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "1px solid #FECACA",
                        fontSize: "12px",
                        fontWeight: "500",
                        zIndex: 100,
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        maxWidth: "90%",
                        textAlign: "center",
                    }}>
                        {connectionError}
                    </div>
                )}

                {/* Drop Zone Hint (shown when no nodes) */}
                {nodes.length === 0 && (
                    <div style={dropHintStyle}>
                        <div style={dropHintContentStyle}>
                            <div style={dropHintIconStyle}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <h3 style={dropHintTextStyle}>
                                {(isMobile || isTablet) ? "Tap '+' to add processor" : "Drag Processors Here"}
                            </h3>
                            <p style={dropHintSubtextStyle}>
                                {(isMobile || isTablet)
                                    ? "Use the Tasks button below to add processors"
                                    : "Drag and drop processors from the sidebar to start building your flow"
                                }
                            </p>
                        </div>
                    </div>
                )}

                <ConnectionDialog
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onConfirm={confirmConnection}
                />
            </div>

            {/* Footer Bar */}
            <div style={footerBarStyle}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? "8px" : "16px",
                    flexWrap: "wrap",
                }}>
                    {!(isMobile || isTablet) && (
                        <>
                            <span>Flow ID: <strong>{currentFlowId}</strong></span>
                            <span>•</span>
                        </>
                    )}
                    <span>Press <kbd style={{
                        padding: isMobile ? "1px 4px" : "2px 6px",
                        backgroundColor: "#F1F3F5",
                        border: "1px solid #D1D5DA",
                        borderRadius: "4px",
                        fontFamily: "monospace",
                        fontSize: isMobile ? "9px" : "11px",
                    }}>Delete</kbd> to remove</span>
                </div>
                {!(isMobile || isTablet) && (
                    <div>
                        <span>Double-click connections to edit</span>
                    </div>
                )}
            </div>

            {/* Publish Modal untuk desktop */}
            {openPublish && (
                <PublishModal onClose={() => setOpenPublish(false)} />
            )}
        </div>
    );
}