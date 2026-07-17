import React from "react";

function Alert({ message, type = "error" }) {
    if (!message) return null;

    const isError = type === "error";

    return (
        <div style={{
            padding: "10px 14px",
            margin: "8px 0",
            borderRadius: "6px",
            border: `1px solid ${isError ? "var(--accent-red)" : "var(--accent-green)"}`,
            backgroundColor: isError
                ? "rgba(220, 53, 69, 0.12)"
                : "rgba(40, 167, 69, 0.12)",
            color: isError ? "var(--accent-red)" : "var(--accent-green)",
            fontSize: "13px",
            fontWeight: "500"
        }}>
            {isError ? "⚠️" : "✅"} {message}
        </div>
    );
}

export default Alert;