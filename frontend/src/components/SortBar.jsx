function SortBar({ sortBy, sortOrder, onSortChange }) {
  const sortOptions = [
    { value: "priority",   label: "⚡ Độ ưu tiên" },
    { value: "created_at", label: "🕐 Ngày tạo" },
    { value: "deadline",   label: "📅 Deadline" },
    { value: "title",      label: "🔤 Tên task" },
    { value: "status",     label: "✅ Trạng thái" }
  ];

  const handleSortByChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      // Bấm lại cùng tiêu chí → đổi chiều
      onSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Bấm tiêu chí khác → reset về asc
      onSortChange(newSortBy, "asc");
    }
  };

  return (
    <div style={{
      display: "flex", gap: "6px", marginBottom: "12px",
      flexWrap: "wrap", alignItems: "center"
    }}>
      <span style={{ fontSize: "13px", color: "var(--text-secondary)", flexShrink: 0 }}>
        Sắp xếp:
      </span>

      {sortOptions.map(opt => {
        const isActive = sortBy === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => handleSortByChange(opt.value)}
            style={{
              padding: "4px 10px",
              fontSize: "12px",
              borderRadius: "6px",
              border: `1px solid ${isActive ? "var(--accent-blue)" : "var(--border-color)"}`,
              cursor: "pointer",
              backgroundColor: isActive ? "var(--accent-blue)" : "var(--bg-secondary)",
              color: isActive ? "#fff" : "var(--text-primary)",
              fontWeight: isActive ? "600" : "normal",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "var(--transition)"
            }}
          >
            {opt.label}
            {/* Mũi tên chỉ chiều sort — chỉ hiện khi đang active */}
            {isActive && (
              <span style={{ fontSize: "10px" }}>
                {sortOrder === "asc" ? "↑" : "↓"}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default SortBar;