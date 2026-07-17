import { useState, useEffect } from "react";
import api from "../api/axios";
import useSocket from "../hooks/useSocket";

function NotificationBell() {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/notifications/unread-count");
      setUnreadCount(res.data.data.count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  // Lắng nghe thông báo real-time
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("new-notification", handleNewNotification);
    return () => socket.off("new-notification", handleNewNotification);
  }, [socket]);

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      try {
        await api.patch(`/notifications/${notification.id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "relative", background: "none", border: "none",
          fontSize: "20px", cursor: "pointer", padding: "6px"
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: 0, right: 0,
            background: "#dc3545", color: "#fff",
            borderRadius: "50%", fontSize: "10px",
            width: "16px", height: "16px",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: "absolute", top: "100%", right: 0,
          width: "320px", maxHeight: "400px", overflowY: "auto",
          background: "var(--bg-card)",
          border: `1px solid var(--border-color)`,
          borderRadius: "8px",
          boxShadow: "var(--shadow)",
          zIndex: 100
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 14px",
            borderBottom: `1px solid var(--border-light)`
          }}>
            <strong style={{ fontSize: "14px", color: "var(--text-primary)" }}>Thông báo</strong>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{ background: "none", border: "none", color: "#007bff", fontSize: "12px", cursor: "pointer" }}
              >
                Đánh dấu đã đọc tất cả
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
              Không có thông báo nào.
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                style={{
                  padding: "10px 14px",
                  borderBottom: `1px solid var(--border-light)`,
                  cursor: "pointer",
                  background: n.is_read ? "var(--bg-card)" : "var(--bg-secondary)"
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: n.is_read ? "normal" : "600", color: "var(--text-primary)" }}>
                  {n.title}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  {n.message}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-placeholder)", marginTop: "4px" }}>
                  {new Date(n.created_at).toLocaleString("vi-VN")}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;