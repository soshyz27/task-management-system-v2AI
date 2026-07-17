import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import Alert from "../components/Alert";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Vui lòng nhập Email!");
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (!password) {
      setError("Vui lòng nhập Mật khẩu!");
      setTimeout(() => setError(""), 2000);
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/login", { email, password });
      const { token, user: userData } = response.data;
      login(token, userData);
      navigate("/dashboard", {
        state: { flashSuccess: `🎉 Chào mừng ${userData.username}!` }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
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
      {/* Toggle theme ở góc trên phải */}
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
        maxWidth: "400px",
        padding: "30px",
        backgroundColor: "var(--bg-card)",
        borderRadius: "12px",
        border: `1px solid var(--border-color)`,
        boxShadow: "var(--shadow)",
        margin: "20px"
      }}>
        <h2 style={{ margin: "0 0 6px 0", color: "var(--text-primary)", textAlign: "center" }}>
          📋 Task Manager
        </h2>
        <p style={{ margin: "0 0 24px 0", color: "var(--text-muted)", textAlign: "center", fontSize: "14px" }}>
          Đăng nhập để tiếp tục
        </p>

        <Alert message={error} type="error" />

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", color: "var(--text-secondary)", fontWeight: "500" }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{
                width: "100%", padding: "10px 12px",
                backgroundColor: "var(--bg-input)",
                border: `1px solid var(--border-color)`,
                borderRadius: "6px",
                color: "var(--text-primary)",
                fontSize: "14px",
                outline: "none",
                transition: "var(--transition)"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", color: "var(--text-secondary)", fontWeight: "500" }}>
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={{
                width: "100%", padding: "10px 12px",
                backgroundColor: "var(--bg-input)",
                border: `1px solid var(--border-color)`,
                borderRadius: "6px",
                color: "var(--text-primary)",
                fontSize: "14px",
                outline: "none",
                transition: "var(--transition)"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "11px",
              backgroundColor: loading ? "var(--text-muted)" : "var(--accent-blue)",
              color: "#fff", border: "none", borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold", fontSize: "14px",
              transition: "var(--transition)"
            }}
          >
            {loading ? "Đang xác thực..." : "Đăng Nhập"}
          </button>

          {/* Phần Đăng ký mới được thêm vào */}
          <p style={{
            textAlign: "center",
            margin: "16px 0 0 0",
            fontSize: "14px",
            color: "var(--text-muted)"
          }}>
            Chưa có tài khoản?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{
                color: "var(--accent-blue)",
                cursor: "pointer",
                fontWeight: "500",
                textDecoration: "underline"
              }}
            >
              Đăng ký ngay
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;