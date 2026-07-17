import { useState, useEffect } from "react";
import api from "../api/axios";

// Các loại file ảnh có thể preview
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

// Format dung lượng file
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Icon theo loại file
function FileIcon({ mimetype }) {
  if (IMAGE_TYPES.includes(mimetype)) return <span>🖼️</span>;
  if (mimetype === "application/pdf") return <span>📄</span>;
  if (mimetype?.includes("word")) return <span>📝</span>;
  return <span>📎</span>;
}

function AttachmentSection({ taskId }) {
  const [attachments, setAttachments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [previewUrl, setPreviewUrl] = useState(null);

  const showMsg = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  // Lấy danh sách file đính kèm
  const fetchAttachments = async () => {
    try {
      const res = await api.get(`/tasks/${taskId}/attachments`);
      setAttachments(res.data.data || []);
    } catch {
      // Task có thể chưa có file nào
    }
  };

  useEffect(() => {
    fetchAttachments();
  }, [taskId]);

  // Xử lý chọn file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate kích thước ở frontend (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMsg("File quá lớn! Tối đa 5MB.", "error");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  // Xử lý upload
  const handleUpload = async () => {
    if (!selectedFile) {
      showMsg("Vui lòng chọn file trước.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile); // field name phải khớp với upload.single("file")

    try {
      setUploading(true);
      await api.post(`/tasks/${taskId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      showMsg("Upload file thành công!");
      setSelectedFile(null);
      // Reset input file
      document.getElementById(`file-input-${taskId}`).value = "";
      fetchAttachments();
    } catch (err) {
      showMsg(err.response?.data?.message || "Upload thất bại.", "error");
    } finally {
      setUploading(false);
    }
  };

  // Xử lý download
  const handleDownload = async (attachment) => {
    try {
      const res = await api.get(
        `/tasks/${taskId}/attachments/${attachment.id}/download`,
        { responseType: "blob" } // Quan trọng: nhận dữ liệu dạng binary
      );

      // Tạo URL tạm thời và trigger download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", attachment.originalname);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      showMsg("Tải file thất bại.", "error");
    }
  };

  // Xử lý preview ảnh
  const handlePreview = (attachment) => {
    const backendUrl = import.meta.env.VITE_API_URL.replace("/api", "");
    setPreviewUrl(`${backendUrl}/uploads/${attachment.filename}`);
  };

  // Xử lý xóa file
  const handleDelete = async (attachmentId) => {
    if (!window.confirm("Xóa file này?")) return;
    try {
      await api.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
      showMsg("Đã xóa file.");
      fetchAttachments();
    } catch {
      showMsg("Xóa file thất bại.", "error");
    }
  };

  return (
    <div style={{ marginTop: "12px", padding: "12px", background: "#f8f9fa", borderRadius: "6px", border: "1px solid #e9ecef" }}>
      <h5 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#555" }}>📎 File đính kèm</h5>

      {/* Thông báo */}
      {message.text && (
        <div style={{
          padding: "8px 12px", marginBottom: "10px", borderRadius: "4px", fontSize: "13px",
          background: message.type === "error" ? "#f8d7da" : "#d1e7dd",
          color: message.type === "error" ? "#842029" : "#0f5132"
        }}>
          {message.text}
        </div>
      )}

      {/* Khu vực upload */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
        <input
          id={`file-input-${taskId}`}
          type="file"
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
          disabled={uploading}
          style={{ fontSize: "13px" }}
        />
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          style={{
            padding: "5px 14px", background: !selectedFile || uploading ? "#ccc" : "#28a745",
            color: "#fff", border: "none", borderRadius: "4px", cursor: !selectedFile || uploading ? "not-allowed" : "pointer",
            fontSize: "13px", whiteSpace: "nowrap"
          }}
        >
          {uploading ? "Đang upload..." : "⬆ Upload"}
        </button>
      </div>

      {/* Danh sách file */}
      {attachments.length === 0 ? (
        <p style={{ margin: 0, color: "#999", fontSize: "13px" }}>Chưa có file đính kèm nào.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {attachments.map((att) => (
            <div key={att.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 10px", background: "#fff", borderRadius: "4px",
              border: "1px solid #dee2e6", flexWrap: "wrap", gap: "8px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                <FileIcon mimetype={att.mimetype} />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "500" }}>{att.originalname}</div>
                  <div style={{ fontSize: "11px", color: "#888" }}>
                    {formatFileSize(att.filesize)} • {att.uploaded_by} • {new Date(att.created_at).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "6px" }}>
                {/* Nút Preview — chỉ hiện với ảnh */}
                {IMAGE_TYPES.includes(att.mimetype) && (
                  <button
                    onClick={() => handlePreview(att)}
                    style={{ padding: "3px 8px", background: "#17a2b8", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                  >
                    👁 Preview
                  </button>
                )}

                {/* Nút Download */}
                <button
                  onClick={() => handleDownload(att)}
                  style={{ padding: "3px 8px", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                >
                  ⬇ Tải về
                </button>

                {/* Nút Xóa */}
                <button
                  onClick={() => handleDelete(att.id)}
                  style={{ padding: "3px 8px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                >
                  🗑 Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Preview ảnh */}
      {previewUrl && (
        <div
          onClick={() => setPreviewUrl(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, cursor: "pointer"
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative" }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: "6px", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
            />
            <button
              onClick={() => setPreviewUrl(null)}
              style={{
                position: "absolute", top: "-12px", right: "-12px",
                background: "#dc3545", color: "#fff", border: "none",
                borderRadius: "50%", width: "28px", height: "28px",
                cursor: "pointer", fontSize: "14px", fontWeight: "bold"
              }}
            >✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttachmentSection;