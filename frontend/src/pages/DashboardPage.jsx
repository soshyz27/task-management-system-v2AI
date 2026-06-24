import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // 🟢 Thêm useLocation để lấy state truyền sang
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import Alert from "../components/Alert";

function DashboardPage() {
    const location = useLocation(); // 🟢 Khởi tạo hook location
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    
    // Quản lý các trạng thái UX mới
    const [pageLoading, setPageLoading] = useState(true); 
    const [btnLoading, setBtnLoading] = useState(false);  
    const [errorMessage, setErrorMessage] = useState(""); 
    const [successMessage, setSuccessMessage] = useState(""); 

    // Hàm tiện ích hiển thị thông báo thành công ngắn hạn
    const showSuccess = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(""), 3000); // Tự biến mất sau 3 giây
    };

    // 🟢 Hứng thông báo thành công từ trang Login chuyển sang
    useEffect(() => {
        if (location.state?.flashSuccess) {
            showSuccess(location.state.flashSuccess);
            
            // Xóa state trong lịch sử trình duyệt để tránh lặp lại thông báo khi F5 (Refresh)
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // 1. Lấy danh sách Task 
    const fetchTasks = async () => {
        try {
            setPageLoading(true);
            const response = await api.get("/tasks");
            setTasks(response.data.data || response.data);
        } catch (error) {
            console.error("Lỗi fetch tasks:", error);
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // 2. Tạo Task Mới 
    const handleCreateTask = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!title.trim()) return setErrorMessage("Tiêu đề công việc là bắt buộc không được để trống!");
        if (title.length > 255) return setErrorMessage("Tiêu đề quá dài (Giới hạn tối đa 255 ký tự)!");

        try {
            setBtnLoading(true);
            await api.post("/tasks", { title, description });
            setTitle("");
            setDescription("");
            showSuccess("Chúc mừng! Đã tạo công việc mới thành công.");
            fetchTasks(); 
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Lỗi hệ thống không thể tạo Task.");
        } finally {
            setBtnLoading(false);
        }
    };

    // 3. Xóa Task 
    const handleDeleteTask = async (id) => {
        const confirmed = window.confirm("Cảnh báo: Bạn có chắc chắn muốn xóa vĩnh viễn công việc này?");
        if (!confirmed) return; 

        try {
            await api.delete(`/tasks/${id}`);
            showSuccess("Đã xóa công việc khỏi hệ thống.");
            fetchTasks();
        } catch (error) {
            alert("Bạn không có quyền sở hữu hoặc công việc này không tồn tại.");
        }
    };

    const handleCompleteTask = async (task) => {
        try {
            await api.put(`/tasks/${task.id}`, {
                title: task.title,
                description: task.description,
                status: "completed"
            });
            showSuccess("Đã cập nhật trạng thái: Hoàn thành!");
            fetchTasks();
        } catch (error) {
            alert("Cập nhật thất bại.");
        }
    };

    // --- HIỂN THỊ MÀN HÌNH LOADING KHI ĐANG TẢI TRANG ---
    if (pageLoading) {
        return (
            <MainLayout>
                <div style={{ textAlign: "center", marginTop: "100px" }}>
                    <h2 style={{ color: "#007BFF" }}>Đang đồng bộ dữ liệu với máy chủ...</h2>
                    <p style={{ color: "#666", fontStyle: "italic" }}>Vui lòng giữ kết nối internet ổn định.</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                
                {/* Khu vực hiển thị thông báo trạng thái */}
                <Alert message={errorMessage} type="error" />
                <Alert message={successMessage} type="success" />

                {/* Form Add Task */}
                <section style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "6px", marginBottom: "30px", border: "1px solid #ddd" }}>
                    <h3>Add New Task</h3>
                    <form onSubmit={handleCreateTask} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <input type="text" placeholder="Task Title *" value={title} onChange={(e) => setTitle(e.target.value)} disabled={btnLoading} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
                        <textarea placeholder="Description..." value={description} onChange={(e) => setDescription(e.target.value)} disabled={btnLoading} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", minHeight: "60px" }} />
                        <button type="submit" disabled={btnLoading} style={{ padding: "10px", backgroundColor: btnLoading ? "#cccccc" : "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: btnLoading ? "not-allowed" : "pointer", fontWeight: "bold" }}>
                            {btnLoading ? "Đang xử lý tạo dữ liệu..." : "Create Task"}
                        </button>
                    </form>
                </section>

                {/* Danh sách Task */}
                <section>
                    <h3>Your Tasks ({tasks.length})</h3>
                    {tasks.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px 20px", border: "2px dashed #ccc", borderRadius: "8px", backgroundColor: "#fafafa" }}>
                            <p style={{ margin: "0 0 10px 0", color: "#777", fontWeight: "500", fontSize: "16px" }}>📭 Danh sách đang trống rỗng!</p>
                            <p style={{ margin: 0, color: "#999", fontSize: "14px" }}>Bạn chưa có công việc nào cần xử lý. Hãy tạo task đầu tiên của bạn ở form phía trên.</p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            {tasks.map((task) => (
                                <div key={task.id} style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "6px", backgroundColor: task.status === "completed" ? "#e2f0d9" : "#fff", borderLeft: task.status === "completed" ? "6px solid #28a745" : "6px solid #ffc107" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <div>
                                            <h4 style={{ margin: "0 0 5px 0", textDecoration: task.status === "completed" ? "line-through" : "none" }}>{task.title}</h4>
                                            <p style={{ margin: "0 0 10px 0", color: "#555", fontSize: "14px" }}>{task.description || "Không có mô tả"}</p>
                                            <span style={{ padding: "3px 8px", fontSize: "12px", borderRadius: "12px", backgroundColor: task.status === "completed" ? "#28a745" : "#ffc107", color: task.status === "completed" ? "#fff" : "#000" }}>{task.status}</span>
                                        </div>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            {task.status !== "completed" && (
                                                <button onClick={() => handleCompleteTask(task)} style={{ padding: "5px 10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>Complete</button>
                                            )}
                                            <button onClick={() => handleDeleteTask(task.id)} style={{ padding: "5px 10px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </MainLayout>
    );
}

export default DashboardPage;