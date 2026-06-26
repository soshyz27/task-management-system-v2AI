import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import Alert from "../components/Alert";

function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // --- FRONTEND VALIDATION ---
    if (!username.trim()) {
      setError("Vui lòng nhập Tên người dùng!");
      return;
    }
    if (username.trim().length < 3) {
      setError("Tên người dùng phải có ít nhất 3 ký tự!");
      return;
    }
    if (!email.trim()) {
      setError("Vui lòng nhập Email!");
      return;
    }
    if (!password) {
      setError("Vui lòng nhập Mật khẩu!");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    // --- GỌI API ĐĂNG KÝ ---
    try {
      setLoading(true);
      await api.post("/auth/register", { username, email, password });

      // Chuyển sang trang Login kèm thông báo thành công
      navigate("/login", {
        state: {
          flashSuccess: "🎉 Đăng ký tài khoản thành công! Vui lòng đăng nhập."
        }
      });
    } catch (err) {
      const apiMessage =
        err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!";
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
    transition: "border-color 0.2s",
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
            Tạo tài khoản mới
          </h2>
          <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>
            Đăng ký để bắt đầu quản lý công việc
          </p>
        </div>

        {/* Alert lỗi */}
        <Alert message={error} type="error" />

        {/* Form */}
        <form onSubmit={handleRegister}>
          {/* Username */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Tên người dùng</label>
            <input
              type="text"
              placeholder="Nhập tên hiển thị..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              style={inputStyle}
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Mật khẩu</label>
            <input
              type="password"
              placeholder="Tối thiểu 6 ký tự..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={inputStyle}
            />
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              style={inputStyle}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: loading ? "#cccccc" : "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "15px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
          >
            {loading ? "Đang tạo tài khoản..." : "Đăng Ký"}
          </button>
        </form>

        {/* Link quay lại Login */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "14px",
            color: "#666",
          }}
        >
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            style={{
              color: "#007BFF",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;