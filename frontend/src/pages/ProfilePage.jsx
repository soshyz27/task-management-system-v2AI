import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import Alert from "../components/Alert";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";

function ProfilePage() {
  const { user, login, token } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // State đổi username
  const [newUsername, setNewUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameMsg, setUsernameMsg] = useState({ text: "", type: "" });

  // State đổi password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ text: "", type: "" });

  const showMsg = (setter, text, type = "success") => {
    setter({ text, type });
    setTimeout(() => setter({ text: "", type: "" }), 3000);
  };

  // Fetch profile + stats
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/profile");
      setProfile(res.data.data);
      setNewUsername(res.data.data.username);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Đổi username
  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (newUsername.trim() === profile?.username) {
      showMsg(setUsernameMsg, "Username không thay đổi.", "error");
      return;
    }
    try {
      setUsernameLoading(true);
      const res = await api.patch("/profile/username", { username: newUsername });
      // Cập nhật lại AuthContext để Header hiện đúng tên
      login(token, { ...user, username: res.data.data.username });
      showMsg(setUsernameMsg, "Cập nhật username thành công!");
      fetchProfile();
    } catch (err) {
      showMsg(setUsernameMsg, err.response?.data?.message || "Lỗi cập nhật.", "error");
    } finally {
      setUsernameLoading(false);
    }
  };

  // Đổi password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showMsg(setPasswordMsg, "Mật khẩu xác nhận không khớp!", "error");
      return;
    }

    try {
      setPasswordLoading(true);
      await api.patch("/profile/password", { currentPassword, newPassword });
      showMsg(setPasswordMsg, "Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showMsg(setPasswordMsg, err.response?.data?.message || "Lỗi đổi mật khẩu.", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const cardStyle = {
    backgroundColor: "var(--bg-card)",
    border: `1px solid var(--border-color)`,
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px"
  };

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: "6px",
    border: `1px solid var(--border-color)`,
    backgroundColor: "var(--bg-input)",
    color: "var(--text-primary)",
    fontSize: "14px",
    boxSizing: "border-box"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontSize: "13px",
    color: "var(--text-secondary)",
    fontWeight: "500"
  };

  if (loading) {
    return (
      <MainLayout>
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <h2 style={{ color: "var(--accent-blue)" }}>Đang tải profile...</h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "none", border: "none",
              cursor: "pointer", fontSize: "20px",
              color: "var(--text-muted)"
            }}
          >
            ←
          </button>
          <h2 style={{ margin: 0, color: "var(--text-primary)" }}>👤 Hồ Sơ Cá Nhân</h2>
        </div>

        {/* Avatar + Info card */}
        <div style={{ ...cardStyle, textAlign: "center", padding: "30px 20px" }}>
          {/* Avatar chữ cái */}
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            backgroundColor: "var(--accent-purple)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "32px", fontWeight: "bold", color: "#fff",
            margin: "0 auto 16px"
          }}>
            {profile?.username?.charAt(0).toUpperCase()}
          </div>

          <h3 style={{ margin: "0 0 4px 0", color: "var(--text-primary)", fontSize: "20px" }}>
            {profile?.username}
          </h3>
          <p style={{ margin: "0 0 4px 0", color: "var(--text-muted)", fontSize: "14px" }}>
            {profile?.email}
          </p>
          <span style={{
            display: "inline-block", padding: "3px 10px",
            borderRadius: "12px", fontSize: "12px",
            backgroundColor: profile?.role === "admin" ? "var(--accent-purple)" : "var(--accent-blue)",
            color: "#fff", fontWeight: "600"
          }}>
            {profile?.role === "admin" ? "🛡️ Admin" : "👤 User"}
          </span>
          <p style={{ margin: "12px 0 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
            Tham gia từ {new Date(profile?.created_at).toLocaleDateString("vi-VN")}
          </p>
        </div>

        {/* Task Statistics */}
        {profile?.stats && (
          <div style={cardStyle}>
            <h4 style={{ margin: "0 0 16px 0", color: "var(--text-primary)" }}>
              📊 Thống Kê Công Việc
            </h4>

            {/* Progress bar */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  Tỷ lệ hoàn thành
                </span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--accent-green)" }}>
                  {profile.stats.completionRate}%
                </span>
              </div>
              <div style={{
                height: "8px", borderRadius: "4px",
                backgroundColor: "var(--bg-secondary)",
                overflow: "hidden"
              }}>
                <div style={{
                  height: "100%", borderRadius: "4px",
                  width: `${profile.stats.completionRate}%`,
                  backgroundColor: profile.stats.completionRate >= 70
                    ? "var(--accent-green)"
                    : profile.stats.completionRate >= 40
                      ? "var(--accent-yellow)"
                      : "var(--accent-red)",
                  transition: "width 0.5s ease"
                }} />
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {[
                { label: "Tổng task", value: profile.stats.total, color: "var(--accent-blue)" },
                { label: "Hoàn thành", value: profile.stats.completed, color: "var(--accent-green)" },
                { label: "Đang làm", value: profile.stats.pending, color: "var(--accent-yellow)" },
                { label: "Ưu tiên cao", value: profile.stats.highPending, color: "var(--accent-red)" },
                { label: "Quá hạn", value: profile.stats.overdue, color: "#ff4444" },
                { label: "Hoàn thành", value: `${profile.stats.completionRate}%`, color: "var(--accent-purple)" }
              ].map((stat, idx) => (
                <div key={idx} style={{
                  textAlign: "center", padding: "12px 8px",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-secondary)",
                  border: `1px solid var(--border-color)`
                }}>
                  <div style={{ fontSize: "22px", fontWeight: "bold", color: stat.color }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Đổi username */}
        <div style={cardStyle}>
          <h4 style={{ margin: "0 0 16px 0", color: "var(--text-primary)" }}>
            ✏️ Đổi Tên Hiển Thị
          </h4>

          <Alert message={usernameMsg.text} type={usernameMsg.type} />

          <form onSubmit={handleUpdateUsername} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Username mới</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                disabled={usernameLoading}
                placeholder="Nhập username mới..."
                style={inputStyle}
              />
            </div>
            <button
              type="submit"
              disabled={usernameLoading || !newUsername.trim()}
              style={{
                padding: "9px",
                backgroundColor: usernameLoading ? "var(--text-muted)" : "var(--accent-blue)",
                color: "#fff", border: "none", borderRadius: "6px",
                cursor: usernameLoading ? "not-allowed" : "pointer",
                fontWeight: "500", fontSize: "14px"
              }}
            >
              {usernameLoading ? "Đang cập nhật..." : "💾 Lưu Username"}
            </button>
          </form>
        </div>

        {/* Đổi mật khẩu */}
        <div style={cardStyle}>
          <h4 style={{ margin: "0 0 16px 0", color: "var(--text-primary)" }}>
            🔒 Đổi Mật Khẩu
          </h4>

          <Alert message={passwordMsg.text} type={passwordMsg.type} />

          <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Mật khẩu hiện tại</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={passwordLoading}
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={passwordLoading}
                placeholder="••••••••"
                style={inputStyle}
              />
              {newPassword && newPassword.length < 6 && (
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--accent-red)" }}>
                  Ít nhất 6 ký tự
                </p>
              )}
            </div>
            <div>
              <label style={labelStyle}>Xác nhận mật khẩu mới</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={passwordLoading}
                placeholder="••••••••"
                style={inputStyle}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--accent-red)" }}>
                  Mật khẩu không khớp
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
              style={{
                padding: "9px",
                backgroundColor: passwordLoading ? "var(--text-muted)" : "var(--accent-green)",
                color: "#fff", border: "none", borderRadius: "6px",
                cursor: passwordLoading ? "not-allowed" : "pointer",
                fontWeight: "500", fontSize: "14px"
              }}
            >
              {passwordLoading ? "Đang đổi mật khẩu..." : "🔒 Đổi Mật Khẩu"}
            </button>
          </form>
        </div>

      </div>
    </MainLayout>
  );
}

export default ProfilePage;