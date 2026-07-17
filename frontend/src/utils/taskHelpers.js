export const PRIORITY_CONFIG = {
  high:   { label: "🔴 Cao",    bg: "#dc3545", color: "#fff" },
  medium: { label: "🟡 Trung bình", bg: "#ffc107", color: "#000" },
  low:    { label: "🟢 Thấp",   bg: "#28a745", color: "#fff" }
};

export const CATEGORY_CONFIG = {
  bug_fix:  { label: "🐛 Bug Fix",   bg: "#f8d7da" },
  feature:  { label: "✨ Feature",   bg: "#cce5ff" },
  meeting:  { label: "📅 Meeting",   bg: "#e2d9f3" },
  report:   { label: "📊 Report",    bg: "#fff3cd" },
  research: { label: "🔬 Research",  bg: "#d1ecf1" },
  other:    { label: "📌 Other",     bg: "#e2e3e5" }
};

export function getPriorityConfig(priority) {
  return PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
}

export function getCategoryConfig(category) {
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other;
}

/**
 * Tính trạng thái deadline
 */
export function getDeadlineStatus(deadline) {
  if (!deadline) return null;

  const now = new Date();
  const due = new Date(deadline);
  const diffMs = due - now;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMs < 0) {
    return {
      label: "⛔ Quá hạn",
      bg: "#dc3545",
      color: "#fff",
      urgent: true,
      text: `Quá hạn ${Math.abs(diffDays)} ngày`
    };
  }

  if (diffHours < 24) {
    return {
      label: `🔴 Còn ${diffHours} giờ`,
      bg: "#ff4444",
      color: "#fff",
      urgent: true,
      text: `Còn ${diffHours} giờ`
    };
  }

  if (diffDays <= 2) {
    return {
      label: `🟠 Còn ${diffDays} ngày`,
      bg: "#fd7e14",
      color: "#fff",
      urgent: true,
      text: `Còn ${diffDays} ngày`
    };
  }

  if (diffDays <= 7) {
    return {
      label: `🟡 Còn ${diffDays} ngày`,
      bg: "#ffc107",
      color: "#000",
      urgent: false,
      text: `Còn ${diffDays} ngày`
    };
  }

  return {
    label: `🟢 Còn ${diffDays} ngày`,
    bg: "#28a745",
    color: "#fff",
    urgent: false,
    text: `Còn ${diffDays} ngày`
  };
}

/**
 * Format deadline để hiển thị
 */
export function formatDeadline(deadline) {
  if (!deadline) return null;
  return new Date(deadline).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}