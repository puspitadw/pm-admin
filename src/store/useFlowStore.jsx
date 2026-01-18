import React from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "reactflow";


export const useFlowStore = create(
    persist(
        (set) => ({
            flows: {},
            currentFlowId: null,

            setCurrentFlow: (flowId) =>
                set((state) => ({
                    currentFlowId: flowId,
                    flows: {
                        ...state.flows,
                        [flowId]: state.flows[flowId] ?? { nodes: [], edges: [] },
                    },
                })),

            addNode: (position, label) =>
                set((state) => {
                    const flow = state.flows[state.currentFlowId];
                    if (!flow) return state;

                    return {
                        flows: {
                            ...state.flows,
                            [state.currentFlowId]: {
                                ...flow,
                                nodes: [
                                    ...flow.nodes,
                                    {
                                        id: nanoid(),
                                        type: "processor", 
                                        position,
                                        data: { label },
                                    },
                                ],
                            },
                        },
                    };
                }),

            updateNodePosition: (nodeId, newPosition) =>
                set((state) => {
                    const flowId = state.currentFlowId;
                    if (!flowId || !state.flows[flowId]) return state;

                    return {
                        flows: {
                            ...state.flows,
                            [flowId]: {
                                ...state.flows[flowId],
                                nodes: state.flows[flowId].nodes.map(node =>
                                    node.id === nodeId
                                        ? { ...node, position: newPosition }
                                        : node
                                ),
                            },
                        },
                    };
                }),

            onNodesChange: (changes) =>
                set((state) => {
                    const flow = state.flows[state.currentFlowId];
                    if (!flow) return state;

                    return {
                        flows: {
                            ...state.flows,
                            [state.currentFlowId]: {
                                ...flow,
                                nodes: applyNodeChanges(changes, flow.nodes),
                            },
                        },
                    };
                }),

            onEdgesChange: (changes) =>
                set((state) => {
                    const flow = state.flows[state.currentFlowId];
                    if (!flow) return state;

                    return {
                        flows: {
                            ...state.flows,
                            [state.currentFlowId]: {
                                ...flow,
                                edges: applyEdgeChanges(changes, flow.edges),
                            },
                        },
                    };
                }),

            onConnect: (connection) =>
                set((state) => {
                    const flow = state.flows[state.currentFlowId];
                    if (!flow) return state;

                    const newEdge = {
                        ...connection,
                        type: 'default',      
                        animated: false,      
                        markerEnd: {
                            type: 'arrow',      
                        },
                    };

                    return {
                        flows: {
                            ...state.flows,
                            [state.currentFlowId]: {
                                ...flow,
                                edges: addEdge(newEdge, flow.edges),
                            },
                        },
                    };
                }),


            removeNodeById: (nodeId) => 
                set((state) => {
                    const flow = state.flows[state.currentFlowId]; 
                    if (!flow) return state;

                    return {
                        flows: {
                            ...state.flows,
                            [state.currentFlowId]: {
                                ...flow,
                                nodes: flow.nodes.filter((n) => n.id !== nodeId),
                                edges: flow.edges.filter(
                                    (e) => e.source !== nodeId && e.target !== nodeId
                                ),
                            },
                        },
                    };
                }),
        }),
        { name: "design-flow-storage" }
    )
);
