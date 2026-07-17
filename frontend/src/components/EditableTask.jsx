import { useState } from "react";
import useTheme from "../hooks/useTheme";

function EditableTask({ task, onSave, onCancel }) {
  const { isDark } = useTheme();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [deadline, setDeadline] = useState(
    task.deadline
      ? new Date(task.deadline).toISOString().slice(0, 16)
      : ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Tiêu đề không được để trống!");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave({
        title: title.trim(),
        description,
        status: task.status,
        deadline: deadline || null
      });
    } catch (err) {
      setError(err.message || "Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "6px",
    border: `1px solid var(--accent-blue)`,
    backgroundColor: "var(--bg-input)",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

      {/* Error */}
      {error && (
        <div style={{
          padding: "6px 10px", borderRadius: "4px", fontSize: "12px",
          backgroundColor: "rgba(220,53,69,0.12)",
          color: "var(--accent-red)",
          border: "1px solid var(--accent-red)"
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tiêu đề task *"
        disabled={saving}
        autoFocus
        style={{ ...inputStyle, fontSize: "15px", fontWeight: "600" }}
      />

      {/* Description */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Mô tả..."
        disabled={saving}
        rows={3}
        style={{ ...inputStyle, resize: "vertical", minHeight: "70px" }}
      />

      {/* Deadline */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          📅 Deadline
        </label>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          disabled={saving}
          style={inputStyle}
        />
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        <button
          onClick={onCancel}
          disabled={saving}
          style={{
            padding: "6px 14px", borderRadius: "4px",
            border: `1px solid var(--border-color)`,
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
            cursor: "pointer", fontSize: "13px"
          }}
        >
          Hủy
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "6px 14px", borderRadius: "4px",
            border: "none",
            backgroundColor: saving ? "var(--text-muted)" : "var(--accent-blue)",
            color: "#fff",
            cursor: saving ? "not-allowed" : "pointer",
            fontSize: "13px", fontWeight: "500"
          }}
        >
          {saving ? "Đang lưu..." : "💾 Lưu"}
        </button>
      </div>
    </div>
  );
}

export default EditableTask;