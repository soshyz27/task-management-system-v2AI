import { getDeadlineStatus, formatDeadline } from "../utils/taskHelpers";

function DeadlineBadge({ deadline }) {
  if (!deadline) return null;

  const status = getDeadlineStatus(deadline);
  const formatted = formatDeadline(deadline);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
      {/* Badge trạng thái */}
      <span style={{
        padding: "2px 8px",
        fontSize: "11px",
        borderRadius: "12px",
        backgroundColor: status.bg,
        color: status.color,
        fontWeight: "600",
        // Hiệu ứng nhấp nháy khi urgent
        animation: status.urgent ? "pulse 1.5s infinite" : "none"
      }}>
        {status.label}
      </span>

      {/* Ngày cụ thể */}
      <span style={{ fontSize: "11px", color: "#888" }}>
        📅 {formatted}
      </span>

      {/* CSS animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

export default DeadlineBadge;