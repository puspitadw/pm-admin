import React from "react";
import { Handle, Position } from "reactflow";

const nodeTypes = {
  "Plan Tasks": { color: "#0078D4", icon: "📋" },
  "Estimate Effort": { color: "#16C60C", icon: "⏱️" },
  "Define Sprint Goals": { color: "#F7630C", icon: "🎯" },
  "Create User Stories": { color: "#8E44AD", icon: "📝" },
  "Prioritize Backlog": { color: "#E74C3C", icon: "⬆️" },
  "Assign Team Roles": { color: "#3498DB", icon: "👥" },
  "Implement Feature": { color: "#2ECC71", icon: "💻" },
  "Code Review": { color: "#F39C12", icon: "👁️" },
  "Unit Test": { color: "#1ABC9C", icon: "🧪" },
  "Integrate Modules": { color: "#9B59B6", icon: "🔗" },
  "Fix Bugs": { color: "#E74C3C", icon: "🐛" },
  "Document Code": { color: "#34495E", icon: "📚" },
  "Integration Test": { color: "#16A085", icon: "🧩" },
  "Regression Test": { color: "#27AE60", icon: "🔄" },
  "Performance Test": { color: "#2980B9", icon: "⚡" },
  "Security Test": { color: "#8E44AD", icon: "🔒" },
  "Bug Verification": { color: "#D35400", icon: "✅" },
  "Test Report": { color: "#7F8C8D", icon: "📊" },
  "Deploy to Staging": { color: "#3498DB", icon: "🚀" },
  "Verify Deployment": { color: "#2ECC71", icon: "🔍" },
  "Release to Production": { color: "#27AE60", icon: "🏁" },
  "Monitor Deployment": { color: "#16A085", icon: "👀" },
  "Rollback if Needed": { color: "#E74C3C", icon: "↩️" },
  "Notify Stakeholders": { color: "#9B59B6", icon: "📢" },
  "Prepare Report": { color: "#34495E", icon: "📈" },
  "Review Metrics": { color: "#7F8C8D", icon: "📉" },
  "Update Dashboard": { color: "#2980B9", icon: "📱" },
  "Share Insights": { color: "#2ECC71", icon: "💡" },
  "Collect Feedback": { color: "#F39C12", icon: "🗣️" },
  "Archive Reports": { color: "#95A5A6", icon: "🗄️" },
  "Review Sprint Performance": { color: "#3498DB", icon: "📊" },
  "Identify Bottlenecks": { color: "#E74C3C", icon: "🔍" },
  "Define Improvements": { color: "#2ECC71", icon: "✨" },
  "Plan Next Sprint": { color: "#9B59B6", icon: "📅" },
  "Team Retrospective Meeting": { color: "#F39C12", icon: "👥" },
};

export default function ProcessorNode({ data, selected }) {
  const nodeType = nodeTypes[data.label] || { color: "#6A737D", icon: "⚙️" };

  const nodeStyle = {
    minWidth: "180px",
    maxWidth: "220px",
    backgroundColor: "white",
    border: `2px solid ${nodeType.color}`,
    borderRadius: "8px",
    padding: "12px",
    boxShadow: selected
      ? `0 0 0 2px ${nodeType.color}40, 0 4px 12px rgba(0, 0, 0, 0.15)`
      : "0 2px 8px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    position: "relative",
    overflow: "hidden",
  };

  const nodeHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
  };

  const nodeIconStyle = {
    fontSize: "16px",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${nodeType.color}20`,
    borderRadius: "4px",
    flexShrink: 0,
  };

  const nodeTitleStyle = {
    fontSize: "12px",
    fontWeight: "600",
    color: "#24292E",
    lineHeight: "1.3",
    flex: 1,
    wordBreak: "break-word",
  };

  const nodeStatusStyle = {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#16C60C",
    boxShadow: "0 0 0 2px white",
  };

  const nodeFooterStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "10px",
    color: "#6A737D",
    marginTop: "8px",
    paddingTop: "8px",
    borderTop: "1px solid #F1F3F5",
  };

  const nodeTypeBadgeStyle = {
    padding: "2px 6px",
    backgroundColor: `${nodeType.color}15`,
    color: nodeType.color,
    borderRadius: "4px",
    fontWeight: "500",
    fontSize: "9px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const handleStyle = {
    width: "10px",
    height: "10px",
    backgroundColor: "white",
    border: `2px solid ${nodeType.color}`,
    borderRadius: "50%",
  };

  return (
    <div style={nodeStyle}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ ...handleStyle, left: "-6px" }}
        isConnectable={true}
      />

      {/* Node Content */}
      <div style={nodeHeaderStyle}>
        <div style={nodeIconStyle}>
          {nodeType.icon}
        </div>
        <div style={nodeTitleStyle}>
          {data.label}
        </div>
      </div>

      {/* Status Indicator */}
      <div style={nodeStatusStyle} />

      {/* Node Footer */}
      <div style={nodeFooterStyle}>
        <span style={nodeTypeBadgeStyle}>
          Processor
        </span>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ ...handleStyle, right: "-6px" }}
        isConnectable={true}
      />
    </div>
  );
}