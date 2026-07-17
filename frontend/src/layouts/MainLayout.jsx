import React from "react";
import Header from "../components/Header";

function MainLayout({ children }) {
    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "var(--bg-primary)",
            transition: "var(--transition)"
        }}>
            <Header />
            <main style={{
                padding: "20px",
                maxWidth: "1200px",
                margin: "0 auto"
            }}>
                {children}
            </main>
        </div>
    );
}

export default MainLayout;