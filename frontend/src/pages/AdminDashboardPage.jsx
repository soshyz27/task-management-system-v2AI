import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import Alert from "../components/Alert";

function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMsg = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data.data);
  };

  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data.data);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      showMsg("Cập nhật role thành công!");
      fetchUsers();
    } catch {
      showMsg("Cập nhật thất bại.", "error");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Xóa người dùng này?")) return;
    try {
      await api.delete(`/users/${userId}`);
      showMsg("Đã xóa người dùng.");
      fetchUsers();
    } catch {
      showMsg("Xóa thất bại.", "error");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Xóa task này?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      showMsg("Đã xóa task.");
      fetchTasks();
    } catch {
      showMsg("Xóa thất bại.", "error");
    }
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h2>🛡️ Admin Dashboard</h2>

        {/* Stats */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <div style={{ flex: 1, padding: "20px", background: "#e3f2fd", borderRadius: "8px", textAlign: "center" }}>
            <h3 style={{ margin: 0 }}>{users.length}</h3>
            <p style={{ margin: 0 }}>Total Users</p>
          </div>
          <div style={{ flex: 1, padding: "20px", background: "#e8f5e9", borderRadius: "8px", textAlign: "center" }}>
            <h3 style={{ margin: 0 }}>{tasks.length}</h3>
            <p style={{ margin: 0 }}>Total Tasks</p>
          </div>
        </div>

        <Alert message={message.text} type={message.type} />

        {/* Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            onClick={() => setActiveTab("users")}
            style={{ padding: "8px 20px", background: activeTab === "users" ? "#007bff" : "#eee", color: activeTab === "users" ? "#fff" : "#333", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            style={{ padding: "8px 20px", background: activeTab === "tasks" ? "#007bff" : "#eee", color: activeTab === "tasks" ? "#fff" : "#333", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Task Management
          </button>
        </div>

        {/* User Table */}
        {activeTab === "users" && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th style={th}>Username</th>
                <th style={th}>Email</th>
                <th style={th}>Role</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={td}>{user.username}</td>
                  <td style={td}>{user.email}</td>
                  <td style={td}>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      style={{ padding: "4px 8px" }}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td style={td}>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      style={{ padding: "4px 10px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Task Table */}
        {activeTab === "tasks" && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th style={th}>Title</th>
                <th style={th}>Owner</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={td}>{task.title}</td>
                  <td style={td}>{task.username}</td>
                  <td style={td}>
                    <span style={{ padding: "2px 8px", borderRadius: "12px", background: task.status === "completed" ? "#28a745" : "#ffc107", color: task.status === "completed" ? "#fff" : "#000", fontSize: "12px" }}>
                      {task.status}
                    </span>
                  </td>
                  <td style={td}>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      style={{ padding: "4px 10px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </MainLayout>
  );
}

const th = { padding: "10px", textAlign: "left", fontWeight: "bold" };
const td = { padding: "10px" };

export default AdminDashboardPage;