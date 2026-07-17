import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import useTheme from "../hooks/useTheme";
import Alert from "../components/Alert";

function RegisterPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validate
    if (!username.trim()) return setError("Vui lòng nhập Username!");
    if (username.trim().length < 3) return setError("Username phải có ít nhất 3 ký tự!");
    if (!email.trim()) return setError("Vui lòng nhập Email!");
    if (!password) return setError("Vui lòng nhập Mật khẩu!");
    if (password.length < 6) return setError("Mật khẩu phải có ít nhất 6 ký tự!");
    if (password !== confirmPassword) return setError("Mật khẩu xác nhận không khớp!");

    try {
      setLoading(true);
      await api.post("/auth/register", { username, email, password });

      setSuccess("Đăng ký thành công! Đang chuyển sang trang đăng nhập...");
      setTimeout(() => {
        navigate("/login", {
          state: { flashSuccess: "🎉 Đăng ký thành công! Vui lòng đăng nhập." }
        });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại, thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    backgroundColor: "var(--bg-input)",
    border: `1px solid var(--border-color)`,
    borderRadius: "6px",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    transition: "var(--transition)",
    boxSizing: "border-box"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontSize: "13px",
    color: "var(--text-secondary)",
    fontWeight: "500"
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "var(--bg-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "var(--transition)"
    }}>
      {/* Toggle theme */}
      <button
        onClick={toggleTheme}
        style={{
          position: "fixed", top: "16px", right: "16px",
          padding: "6px 12px",
          background: "var(--bg-secondary)",
          border: `1px solid var(--border-color)`,
          borderRadius: "20px",
          cursor: "pointer",
          fontSize: "16px",
          color: "var(--text-primary)"
        }}
      >
        {isDark ? "☀️ Light" : "🌙 Dark"}
      </button>

      <div style={{
        width: "100%",
        maxWidth: "420px",
        padding: "30px",
        backgroundColor: "var(--bg-card)",
        borderRadius: "12px",
        border: `1px solid var(--border-color)`,
        boxShadow: "var(--shadow)",
        margin: "20px"
      }}>
        {/* Header */}
        <h2 style={{ margin: "0 0 6px 0", color: "var(--text-primary)", textAlign: "center" }}>
          📋 Task Manager
        </h2>
        <p style={{ margin: "0 0 24px 0", color: "var(--text-muted)", textAlign: "center", fontSize: "14px" }}>
          Tạo tài khoản mới
        </p>

        <Alert message={error} type="error" />
        <Alert message={success} type="success" />

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Username */}
          <div>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              placeholder="Nhập tên hiển thị..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "var(--accent-blue)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border-color)"}
            />
            {username && username.trim().length < 3 && (
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--accent-red)" }}>
                Ít nhất 3 ký tự
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "var(--accent-blue)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border-color)"}
            />
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "var(--accent-blue)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border-color)"}
            />
            {password && password.length < 6 && (
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--accent-red)" }}>
                Ít nhất 6 ký tự
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label style={labelStyle}>Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "var(--accent-blue)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border-color)"}
            />
            {confirmPassword && password !== confirmPassword && (
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--accent-red)" }}>
                Mật khẩu không khớp
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "11px",
              backgroundColor: loading ? "var(--text-muted)" : "var(--accent-green)",
              color: "#fff", border: "none", borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold", fontSize: "14px",
              transition: "var(--transition)",
              marginTop: "4px"
            }}
          >
            {loading ? "Đang đăng ký..." : "✅ Đăng Ký"}
          </button>
        </form>

        {/* Link về Login */}
        <p style={{
          textAlign: "center",
          margin: "16px 0 0 0",
          fontSize: "14px",
          color: "var(--text-muted)"
        }}>
          Đã có tài khoản?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              color: "var(--accent-blue)",
              cursor: "pointer",
              fontWeight: "500",
              textDecoration: "underline"
            }}
          >
            Đăng nhập
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;