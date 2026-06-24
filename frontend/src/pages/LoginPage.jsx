// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; 
import useAuth from "../hooks/useAuth";
import Alert from "../components/Alert"; // Khai báo Alert component

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Quản lý lỗi (Bước 2)
  const [loading, setLoading] = useState(false); // Trạng thái xử lý (Bước 1)

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError(""); // Xóa thông báo cũ nếu có

    // --- FRONTEND VALIDATION ---
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

    // --- GỌI API ĐĂNG NHẬP ---
    try {
      setLoading(true); 
      const response = await api.post("/auth/login", { email, password });
      const { token, user: userData } = response.data;

      // Cập nhật auth toàn cục và chuyển hướng
      login(token, userData);
      navigate("/dashboard", { 
        state: { 
          flashSuccess: `🎉 Đăng nhập thành công! Chào mừng ${userData.username || 'bạn'}` 
        } 
      });

    } catch (err) {
      // Đọc thông báo lỗi từ Backend trả về
      const apiMessage = err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại!";
      setError(apiMessage);
    } finally {
      setLoading(false); // Mở khóa nút bấm
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "10px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Đăng Nhập Hệ Thống</h2>
      
      {/* Hiển thị Alert nếu có lỗi */}
      <Alert message={error} type="error" />

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Email:</label>
          <input type="email" placeholder="Nhập email..." value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Mật khẩu:</label>
          <input type="password" placeholder="Nhập mật khẩu..." value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} />
        </div>
        
        {/* Nút bấm tự động khóa và đổi chữ khi loading */}
        <button type="submit" disabled={loading} style={{ width: "100%", padding: "10px", backgroundColor: loading ? "#cccccc" : "#007BFF", color: "#fff", border: "none", borderRadius: "4px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "bold" }}>
          {loading ? "Đang xác thực hệ thống..." : "Đăng Nhập"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;