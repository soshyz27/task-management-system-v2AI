import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import NotificationBell from "./NotificationBell";

function Header() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `2px solid var(--border-color)`,
            padding: "10px 20px",
            backgroundColor: "var(--bg-header)",
            transition: "var(--transition)",
            position: "sticky",
            top: 0,
            zIndex: 50
        }}>
            {/* Logo + Welcome */}
            <div>
                <h2 style={{ margin: 0, color: "var(--text-primary)", fontSize: "18px" }}>
                    📋 Quản lý công việc
                </h2>
                {user && (
                    <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                        Chào mừng, <strong style={{ color: "var(--text-secondary)" }}>{user.username}</strong>
                    </span>
                )}
            </div>

            {/* Right side buttons */}
            {user && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                    {/* Notification Bell */}
                    <NotificationBell />

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleTheme}
                        title={isDark ? "Chuyển sang Light Mode" : "Chuyển sang Dark Mode"}
                        style={{
                            padding: "6px 12px",
                            background: "var(--bg-input)",
                            border: `1px solid var(--border-color)`,
                            borderRadius: "20px",
                            cursor: "pointer",
                            fontSize: "16px",
                            color: "var(--text-primary)",
                            transition: "var(--transition)",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                        }}
                    >
                        {isDark ? "☀️" : "🌙"}
                        <span style={{ fontSize: "12px" }}>
                            {isDark ? "Light" : "Dark"}
                        </span>
                    </button>

                    {/* Profile link — bấm vào tên user */}
                    <button
                        onClick={() => navigate("/profile")}
                        style={{
                            padding: "6px 12px",
                            background: "var(--bg-secondary)",
                            border: `1px solid var(--border-color)`,
                            borderRadius: "20px",
                            cursor: "pointer",
                            fontSize: "13px",
                            color: "var(--text-primary)",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                        }}
                    >
                        <span style={{
                            width: "22px", height: "22px",
                            borderRadius: "50%",
                            backgroundColor: "var(--accent-purple)",
                            display: "inline-flex",
                            alignItems: "center", justifyContent: "center",
                            fontSize: "11px", fontWeight: "bold", color: "#fff"
                        }}>
                            {user.username?.charAt(0).toUpperCase()}
                        </span>
                        {user.username}
                    </button>

                    {/* Admin Panel */}
                    {user.role === "admin" && (
                        <button
                            onClick={() => navigate("/admin")}
                            style={{
                                padding: "6px 12px",
                                background: "var(--accent-purple)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "13px"
                            }}
                        >
                            🛡️ Admin
                        </button>
                    )}

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: "6px 16px",
                            backgroundColor: "var(--accent-red)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "13px"
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
}

export default Header;