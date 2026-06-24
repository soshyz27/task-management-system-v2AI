// Tách biệt phần thanh điều hướng và hiển thị thông tin User (username).
import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Header() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout(); // Xóa sạch state toàn cục và localStorage
        navigate("/login"); // Chuyển hướng
    };

    return (
        <header style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            borderBottom: "2px solid #ccc", 
            padding: "10px 20px", 
            backgroundColor: "#f8f9fa" 
        }}>
            <div>
                <h2 style={{ margin: 0, color: "#333" }}>Quản lý công việc</h2>
                {user && <span style={{ fontSize: "14px", color: "#666" }}>Chào mừng, <strong>{user.username}</strong></span>}
            </div>
            {user && (
                <button 
                    onClick={handleLogout} 
                    style={{ padding: "8px 16px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                >
                    Logout
                </button>
            )}
            
        </header>
    );
}

export default Header;