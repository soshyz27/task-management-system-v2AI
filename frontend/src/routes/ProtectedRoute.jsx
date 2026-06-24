// Tận dụng trạng thái loading và isAuthenticated từ 
// Context để tránh việc redirect nhầm khi React chưa đọc xong localStorage.
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    // Chờ Context API đồng bộ dữ liệu từ localStorage xong xuôi
    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <h2>Đang tải dữ liệu hệ thống...</h2>
            </div>
        );
    }

    // Nếu không có quyền truy cập, đẩy ngay về trang Login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;