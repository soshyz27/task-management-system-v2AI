// Gói giao diện có cấu trúc đồng bộ.
import React from "react";
import Header from "../components/Header";

function MainLayout({ children }) {
    return (
        <>
            <Header />
            <main style={{ padding: "20px" }}>
                {children}
            </main>
        </>
    );
}

export default MainLayout;