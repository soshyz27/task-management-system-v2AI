import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";
import Alert from "../components/Alert";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Hứng thông báo thành công từ trang Register chuyển sang
  useEffect(() => {
    if (location.state?.flashSuccess) {
      setSuccessMessage(location.state.flashSuccess);
      window.history.replaceState({}, document.title);
      // Tự xóa sau 5 giây
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Vui lòng nhập Email!");
      return;
    }
    if (!password) {
      setError("Vui lòng nhập Mật khẩu!");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/login", { email, password });
      const { token, user: userData } = response.data;

      login(token, userData);
      navigate("/dashboard", {
        state: {
          flashSuccess: `🎉 Đăng nhập thành công! Chào mừng ${userData.username || "bạn"}`,
        },
      });
    } catch (err) {
      const apiMessage =
        err.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại!";
      setError(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    fontSize: "14px",
    color: "#444",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          padding: "36px 32px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h2 style={{ margin: "0 0 6px 0", fontSize: "24px", color: "#1a1a2e" }}>
            Đăng Nhập Hệ Thống
          </h2>
          <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>
            Quản lý công việc cá nhân của bạn
          </p>
        </div>

        {/* Alert thông báo */}
        <Alert message={successMessage} type="success" />
        <Alert message={error} type="error" />

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="Nhập địa chỉ email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: loading ? "#cccccc" : "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "15px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
          >
            {loading ? "Đang xác thực hệ thống..." : "Đăng Nhập"}
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "20px 0",
            gap: "10px",
          }}
        >
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e0e0e0" }} />
          <span style={{ color: "#aaa", fontSize: "13px" }}>hoặc</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e0e0e0" }} />
        </div>

        {/* Link đăng ký */}
        <div style={{ textAlign: "center", fontSize: "14px", color: "#666" }}>
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            style={{
              color: "#28a745",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;