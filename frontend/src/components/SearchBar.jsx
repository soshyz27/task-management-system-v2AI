import { useState, useEffect, useRef } from "react";

function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState("");
  const debounceRef = useRef(null);

  // Debounce: chờ 500ms sau khi user ngừng gõ mới gọi API
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(value);
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [value]);

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <div style={{ position: "relative", marginBottom: "16px" }}>
      {/* Search icon */}
      <span style={{
        position: "absolute", left: "12px", top: "50%",
        transform: "translateY(-50%)",
        fontSize: "16px", pointerEvents: "none"
      }}>
        🔍
      </span>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tìm kiếm task theo tiêu đề hoặc mô tả..."
        style={{
          width: "100%",
          padding: "10px 40px 10px 40px",
          borderRadius: "8px",
          border: `1px solid var(--border-color)`,
          backgroundColor: "var(--bg-input)",
          color: "var(--text-primary)",
          fontSize: "14px",
          outline: "none",
          boxSizing: "border-box",
          transition: "var(--transition)"
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--accent-blue)";
          e.target.style.boxShadow = "0 0 0 3px rgba(88,166,255,0.15)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--border-color)";
          e.target.style.boxShadow = "none";
        }}
      />

      {/* Loading spinner hoặc nút clear */}
      {loading ? (
        <span style={{
          position: "absolute", right: "12px", top: "50%",
          transform: "translateY(-50%)", fontSize: "14px"
        }}>
          ⏳
        </span>
      ) : value && (
        <button
          onClick={handleClear}
          style={{
            position: "absolute", right: "10px", top: "50%",
            transform: "translateY(-50%)",
            background: "none", border: "none",
            cursor: "pointer", fontSize: "16px",
            color: "var(--text-muted)", padding: "2px 6px",
            borderRadius: "50%"
          }}
          title="Xóa tìm kiếm"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;