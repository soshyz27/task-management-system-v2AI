function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total, limit, hasNext, hasPrev } = pagination;

  // Tạo mảng số trang hiển thị
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // Số trang hiện trước/sau trang hiện tại

    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
      pages.push(i);
    }

    // Thêm "..." nếu cần
    if (pages[0] > 1) {
      if (pages[0] > 2) pages.unshift("...");
      pages.unshift(1);
    }
    if (pages[pages.length - 1] < totalPages) {
      if (pages[pages.length - 1] < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const btnStyle = (active = false, disabled = false) => ({
    padding: "6px 12px",
    margin: "0 2px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: disabled ? "not-allowed" : "pointer",
    backgroundColor: active ? "#6f42c1" : disabled ? "#f5f5f5" : "#fff",
    color: active ? "#fff" : disabled ? "#aaa" : "#333",
    fontWeight: active ? "600" : "normal",
    fontSize: "13px",
    minWidth: "36px"
  });

  return (
    <div style={{ marginTop: "20px" }}>
      {/* Thông tin tổng */}
      <div style={{ textAlign: "center", fontSize: "12px", color: "#888", marginBottom: "10px" }}>
        Hiển thị {(page - 1) * limit + 1}–{Math.min(page * limit, total)} trong tổng số {total} task
      </div>

      {/* Nút phân trang */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>

        {/* Nút Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          style={btnStyle(false, !hasPrev)}
        >
          ‹ Trước
        </button>

        {/* Số trang */}
        {getPageNumbers().map((p, idx) =>
          p === "..." ? (
            <span key={`dots-${idx}`} style={{ padding: "6px 4px", color: "#aaa" }}>...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              style={btnStyle(p === page)}
            >
              {p}
            </button>
          )
        )}

        {/* Nút Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          style={btnStyle(false, !hasNext)}
        >
          Sau ›
        </button>
      </div>
    </div>
  );
}

export default Pagination;