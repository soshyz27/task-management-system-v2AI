import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Trạng thái lưu thông tin User (id, email, username)
  const [user, setUser] = useState(null);
  
  // Khởi tạo trạng thái Token: Ưu tiên lấy từ LocalStorage của trình duyệt nếu đã từng đăng nhập trước đó
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const [loading, setLoading] = useState(true);

    // Đồng bộ thông tin user từ localStorage khi ứng dụng khởi chạy (F5)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Lỗi parse thông tin user:", e);
                localStorage.removeItem("user");
            }
        }
        setLoading(false); // Kết thúc quá trình kiểm tra trạng thái ban đầu
    }, []);

    // Hàm Login dùng chung tập trung
    const login = (newToken, userData) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
    };

    // Hàm Logout dùng chung tập trung
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
                isAuthenticated: !!token // Trả về true nếu có token, false nếu null
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}