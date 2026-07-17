import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, loading, user } = useAuth();

    // 1. Chờ Context API đồng bộ dữ liệu từ localStorage xong xuôi (Giữ giao diện đẹp của bạn)
    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <h2>Đang tải dữ liệu hệ thống...</h2>
            </div>
        );
    }

    // 2. Nếu không đăng nhập, đẩy ngay về trang Login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 3. SPRINT 2 (RBAC): Nếu route yêu cầu quyền cụ thể (ví dụ: 'admin') mà user không đáp ứng được
    if (requiredRole && user?.role !== requiredRole) {
        // Đẩy về dashboard hoặc trang thông báo từ chối truy cập (403 Unauthorized)
        return <Navigate to="/dashboard" replace />;
    }

    // 4. Nếu thỏa mãn tất cả điều kiện, cho phép vào trang
    return children;
}

export default ProtectedRoute;