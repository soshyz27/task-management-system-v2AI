import React from "react";

function Alert({ message, type = "error" }) {
    if (!message) return null;

    // Định nghĩa màu sắc động dựa trên loại thông báo
    const isError = type === "error";
    const backgroundColor = isError ? "#f8d7da" : "#d1e7dd";
    const color = isError ? "#842029" : "#0f5132";
    const borderColor = isError ? "#f5c2c7" : "#badbcc";

    return (
        <div style={{
            padding: "12px 15px",
            margin: "10px 0",
            borderRadius: "4px",
            border: `1px solid ${borderColor}`,
            backgroundColor: backgroundColor,
            color: color,
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.3s ease"
        }}>
            {isError ? "⚠️ " : "✅ "} {message}
        </div>
    );
}

export default Alert;