import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";

export const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Kết nối tới backend (lấy URL từ VITE_API_URL, bỏ phần /api)
    const backendUrl = import.meta.env.VITE_API_URL.replace("/api", "");
    const newSocket = io(backendUrl, {
      transports: ["websocket", "polling"]
    });

    newSocket.on("connect", () => {
      console.log("🔌 Đã kết nối Socket.IO:", newSocket.id);
      // Join vào room riêng để nhận thông báo cá nhân (dùng ở Phần B)
      if (user?.id) {
        newSocket.emit("join", user.id);
      }
    });

    setSocket(newSocket);

    // Cleanup khi component unmount hoặc user logout
    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user?.id]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}