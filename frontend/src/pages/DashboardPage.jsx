import { useEffect, useState, useCallback, useRef } from "react"; 
import { useLocation } from "react-router-dom";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import Alert from "../components/Alert";
import AttachmentSection from "../components/AttachmentSection";
import useSocket from "../hooks/useSocket";
import useAuth from "../hooks/useAuth";
import { getPriorityConfig, getCategoryConfig } from "../utils/taskHelpers";
import Pagination from "../components/Pagination";
import DeadlineBadge from "../components/DeadlineBadge";
import useTheme from "../hooks/useTheme"; 
import EditableTask from "../components/EditableTask";
import SearchBar from "../components/SearchBar"; 
import SortBar from "../components/SortBar";

function DashboardPage() {
    const location = useLocation();
    const socket = useSocket();
    const { user } = useAuth();
    const { isDark } = useTheme(); 

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [pageLoading, setPageLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [users, setUsers] = useState([]);
    const [filterPriority, setFilterPriority] = useState("all");
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const LIMIT = 5;
    const [deadline, setDeadline] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null); 
    
    const [searchQuery, setSearchQuery] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);

    // 1. KHAI BÁO STATE SẮP XẾP MỚI
    const [sortBy, setSortBy] = useState("priority");
    const [sortOrder, setSortOrder] = useState("asc");

    // Dùng trigger để gọi lại API khi có các hành động Mutation (Thêm, Sửa, Xóa)
    const [refreshKey, setRefreshKey] = useState(0);

    // Thêm ref theo dõi request ID (thay thế cho AbortController)
    const fetchIdRef = useRef(0);

    const getLocalISOString = () => {
        const tzOffset = new Date().getTimezoneOffset() * 60000;
        return new Date(Date.now() - tzOffset).toISOString().slice(0, 16);
    };

    const showSuccess = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    const triggerRefresh = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/users");
                setUsers(res.data.data || []);
            } catch {
                // bỏ qua lỗi phân quyền
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (location.state?.flashSuccess) {
            showSuccess(location.state.flashSuccess);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // 2. CẬP NHẬT fetchTasks ĐỂ TRUYỀN THAM SỐ SẮP XẾP LÊN API
    const fetchTasks = useCallback(async (page = 1, priority = "all", search = "", currentSortBy = "priority", currentSortOrder = "asc") => {
        // Tăng ID mỗi lần fetch — dùng để bỏ qua kết quả của request cũ
        const fetchId = ++fetchIdRef.current;

        setSearchLoading(true);

        try {
            const response = await api.get("/tasks/paginated", {
                params: { 
                    page, 
                    limit: LIMIT, 
                    priority, 
                    search,
                    sortBy: currentSortBy,      // ← Đã thêm truyền lên API
                    sortOrder: currentSortOrder // ← Đã thêm truyền lên API
                }
            });

            // Chỉ cập nhật state nếu đây là request MỚI NHẤT
            if (fetchId === fetchIdRef.current) {
                setTasks(response.data.data);
                setPagination(response.data.pagination);
                // pagination.total giờ chính xác vì là kết quả của request MỚI NHẤT
            }
        } catch (error) {
            if (fetchId === fetchIdRef.current) {
                console.error("Lỗi fetch tasks:", error);
            }
        } finally {
            if (fetchId === fetchIdRef.current) {
                setPageLoading(false);
                setSearchLoading(false);
            }
        }
    }, []);

    // 3. THÊM DEPENDENCY CHO EFFECT TỰ ĐỘNG GỌI LẠI KHI ĐỔI TIÊU CHÍ SORT
    useEffect(() => {
        fetchTasks(currentPage, filterPriority, searchQuery, sortBy, sortOrder);
    }, [currentPage, filterPriority, searchQuery, sortBy, sortOrder, refreshKey, fetchTasks]);

    // Các handler xử lý gọn nhẹ hơn, chỉ cần set state, useEffect sẽ tự động lo phần fetch dữ liệu
    const handlePageChange = useCallback((newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 300, behavior: "smooth" });
    }, []);

    const handleFilterChange = useCallback((priority) => {
        setFilterPriority(priority);
        setCurrentPage(1);
    }, []);

    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
        setCurrentPage(1);
    }, []);

    // 4. ĐỊNH NGHĨA HÀM XỬ LÝ KHI THAY ĐỔI SẮP XẾP (ĐỒNG BỘ AN TOÀN TRÁNH UNDEFINED)
    const handleSortChange = useCallback((newSortBy, newSortOrder) => {
        setSortBy(prev => (newSortBy !== undefined && newSortBy !== null) ? newSortBy : prev);
        setSortOrder(prev => (newSortOrder !== undefined && newSortOrder !== null) ? newSortOrder : prev);
        setCurrentPage(1);
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleTaskCreated = (newTask) => {
            setTasks((prev) => {
                if (prev.some(t => t.id === newTask.id)) return prev;
                return [newTask, ...prev];
            });
            showSuccess(`🔔 Có task mới: "${newTask.title}"`);
        };

        const handleTaskUpdated = (updatedTask) => {
            setTasks((prev) =>
                prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
            );
        };

        const handleTaskDeleted = ({ id }) => {
            setTasks((prev) => prev.filter((t) => t.id !== parseInt(id)));
        };

        socket.on("task-created", handleTaskCreated);
        socket.on("task-updated", handleTaskUpdated);
        socket.on("task-deleted", handleTaskDeleted);

        return () => {
            socket.off("task-created", handleTaskCreated);
            socket.off("task-updated", handleTaskUpdated);
            socket.off("task-deleted", handleTaskDeleted);
        };
    }, [socket]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!title.trim()) return setErrorMessage("Tiêu đề không được để trống!");
        if (title.length > 255) return setErrorMessage("Tiêu đề quá dài!");

        const payload = {
            title,
            description,
            deadline: deadline || null,
            ...(assignedTo && assignedTo !== ""
                ? { assignedTo: parseInt(assignedTo) }
                : {})
        };
        setDeadline("");
        
        try {
            setBtnLoading(true);
            await api.post("/tasks", payload);
            setTitle("");
            setDescription("");
            setAssignedTo("");
            showSuccess("Đã tạo công việc mới thành công.");
            setCurrentPage(1);
            triggerRefresh(); // Kích hoạt làm mới danh sách
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Lỗi hệ thống.");
        } finally {
            setBtnLoading(false);
        }
    };

    const handleAISuggest = async () => {
        if (!title.trim()) {
            setErrorMessage("Vui lòng nhập tiêu đề task trước!");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }
        try {
            setAiLoading(true);
            const res = await api.post("/ai/suggest", { title });
            setDescription(res.data.data.description);
            showSuccess("✨ AI đã gợi ý mô tả thành công!");
        } catch (err) {
            setErrorMessage(err.response?.data?.message || "Không thể kết nối AI.");
            setTimeout(() => setErrorMessage(""), 3000);
        } finally {
            setAiLoading(false);
        }
    };

    const handleEditSave = async (taskId, updatedData) => {
        try {
            await api.put(`/tasks/${taskId}`, updatedData);
            showSuccess("Đã cập nhật task thành công!");
            setEditingTaskId(null);
            triggerRefresh(); // Kích hoạt làm mới danh sách
        } catch (err) {
            throw new Error(err.response?.data?.message || "Cập nhật thất bại.");
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm("Xóa công việc này?")) return;
        try {
            await api.delete(`/tasks/${id}`);
            showSuccess("Đã xóa công việc.");
            const newPage = tasks.length === 1 && currentPage > 1
                ? currentPage - 1
                : currentPage;
            setCurrentPage(newPage);
            triggerRefresh(); // Kích hoạt làm mới danh sách
        } catch {
            alert("Không có quyền hoặc task không tồn tại.");
        }
    };

    const handleCompleteTask = async (task) => {
        try {
            await api.put(`/tasks/${task.id}`, {
                title: task.title,
                description: task.description,
                status: "completed",
                deadline: task.deadline || null
            });
            showSuccess("Đã cập nhật: Hoàn thành!");
            triggerRefresh(); // Kích hoạt làm mới danh sách
        } catch {
            alert("Cập nhật thất bại.");
        }
    };

    // Chỉ giữ lại một block check loading toàn trang duy nhất (khi load trang lần đầu)
    if (pageLoading) {
        return (
            <MainLayout>
                <div style={{ textAlign: "center", marginTop: "100px" }}>
                    <h2 style={{ color: "var(--accent-blue)" }}>Đang đồng bộ dữ liệu...</h2>
                    <p style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>Vui lòng giữ kết nối internet.</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>

                <Alert message={errorMessage} type="error" />
                <Alert message={successMessage} type="success" />

                {/* Form Add Task */}
                <section style={{ 
                    backgroundColor: "var(--bg-secondary)", 
                    padding: "15px", 
                    borderRadius: "6px", 
                    marginBottom: "30px", 
                    border: `1px solid var(--border-color)` 
                }}>
                    <h3 style={{ color: "var(--text-primary)" }}>Add New Task</h3>
                    <form onSubmit={handleCreateTask} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <input
                            type="text"
                            placeholder="Task Title *"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={btnLoading}
                            style={{ 
                                padding: "8px", 
                                borderRadius: "4px", 
                                border: `1px solid var(--border-color)`,
                                backgroundColor: "var(--bg-input)",
                                color: "var(--text-primary)",
                                width: "100%"
                            }}
                        />

                        <button
                            type="button"
                            onClick={handleAISuggest}
                            disabled={aiLoading || !title.trim()}
                            style={{
                                padding: "8px",
                                backgroundColor: aiLoading || !title.trim() ? "var(--border-color)" : "var(--accent-purple)",
                                color: "#fff", 
                                border: "none", 
                                borderRadius: "4px",
                                cursor: aiLoading || !title.trim() ? "not-allowed" : "pointer",
                                fontSize: "13px"
                            }}
                        >
                            {aiLoading ? "⏳ AI đang xử lý..." : "✨ AI Gợi Ý Mô Tả"}
                        </button>

                        <textarea
                            placeholder="Description... (hoặc dùng AI gợi ý)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={btnLoading || aiLoading}
                            style={{
                                padding: "8px", 
                                borderRadius: "4px",
                                border: aiLoading ? "1px solid var(--accent-purple)" : "1px solid var(--border-color)",
                                backgroundColor: "var(--bg-input)",
                                color: "var(--text-primary)",
                                minHeight: "80px",
                                width: "100%"
                            }}
                        />
                        
                        {/* Deadline picker */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <label style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "500" }}>
                                📅 Deadline (không bắt buộc)
                            </label>
                            <input
                                type="datetime-local"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                disabled={btnLoading}
                                min={getLocalISOString()} 
                                style={{
                                    padding: "8px", 
                                    borderRadius: "4px",
                                    border: `1px solid var(--border-color)`, 
                                    backgroundColor: "var(--bg-input)",
                                    color: "var(--text-primary)",
                                    fontSize: "13px",
                                    width: "100%"
                                }}
                            />
                        </div>

                        {users.length > 0 && (
                            <select
                                value={assignedTo}
                                onChange={(e) => setAssignedTo(e.target.value)}
                                disabled={btnLoading}
                                style={{ 
                                    padding: "8px", 
                                    borderRadius: "4px", 
                                    border: `1px solid var(--border-color)`,
                                    backgroundColor: "var(--bg-input)",
                                    color: "var(--text-primary)",
                                    width: "100%"
                                }}
                            >
                                <option value="" style={{ backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}>
                                    — Giao cho chính mình —
                                </option>
                                {users.map(u => (
                                    <option 
                                        key={u.id} 
                                        value={u.id} 
                                        style={{ backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
                                    >
                                        {u.username} ({u.email})
                                    </option>
                                ))}
                            </select>
                        )}

                        <button
                            type="submit"
                            disabled={btnLoading}
                            style={{
                                padding: "10px",
                                backgroundColor: btnLoading ? "var(--border-color)" : "var(--accent-green)",
                                color: "#fff", 
                                border: "none", 
                                borderRadius: "4px",
                                cursor: btnLoading ? "not-allowed" : "pointer",
                                fontWeight: "bold"
                            }}
                        >
                            {btnLoading ? "Đang xử lý..." : "Create Task"}
                        </button>
                    </form>
                </section>

                {/* Danh sách Task */}
                <section>
                    <h3 style={{ color: "var(--text-primary)" }}>
                        Your Tasks
                        {pagination && !searchQuery && (
                            <span style={{ fontSize: "14px", fontWeight: "normal", color: "var(--text-secondary)", marginLeft: "8px" }}>
                                (tổng {pagination.total} task)
                            </span>
                        )}
                    </h3>

                    {/* Search bar */}
                    <SearchBar
                        onSearch={handleSearch}
                        loading={searchLoading}
                    />

                    {/* 5. RENDER SORTBAR Ở ĐÂY */}
                    <SortBar
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSortChange={handleSortChange}
                    />

                    {/* Filter bar */}
                    <div style={{ display: "flex", gap: "8px", marginBottom: "15px", flexWrap: "wrap", alignItems: "center", marginTop: "10px" }}>
                        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Lọc:</span>
                        {[
                            { value: "all",    label: "🔍 Tất cả" },
                            { value: "high",   label: "🔴 Cao" },
                            { value: "medium", label: "🟡 Trung bình" },
                            { value: "low",    label: "🟢 Thấp" }
                        ].map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => handleFilterChange(opt.value)}
                                style={{
                                    padding: "4px 12px", 
                                    fontSize: "12px", 
                                    borderRadius: "20px",
                                    border: `1px solid var(--border-color)`, 
                                    cursor: "pointer",
                                    backgroundColor: filterPriority === opt.value ? "var(--accent-purple)" : "var(--bg-secondary)",
                                    color: filterPriority === opt.value ? "#fff" : "var(--text-primary)",
                                    fontWeight: filterPriority === opt.value ? "600" : "normal"
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {/* Hiển thị kết quả search — Chỉ hiện sau khi searchLoading xong */}
                    {searchQuery && !searchLoading && (
                        <div style={{
                            marginBottom: "12px", padding: "8px 12px",
                            backgroundColor: "var(--bg-secondary)",
                            borderRadius: "6px", fontSize: "13px",
                            color: "var(--text-secondary)",
                            border: `1px solid var(--border-color)`
                        }}>
                            🔍 Kết quả cho <strong style={{ color: "var(--text-primary)" }}>"{searchQuery}"</strong>
                            {pagination && (
                                <span> — tìm thấy <strong>{pagination.total}</strong> task</span>
                            )}
                            <button
                                onClick={() => handleSearch("")}
                                style={{
                                    marginLeft: "10px", padding: "1px 8px",
                                    fontSize: "11px", borderRadius: "10px",
                                    border: `1px solid var(--border-color)`,
                                    backgroundColor: "var(--bg-card)",
                                    color: "var(--text-muted)",
                                    cursor: "pointer"
                                }}
                            >
                                ✕ Xóa
                            </button>
                        </div>
                    )}

                    {/* Danh sách rỗng hoặc danh sách tasks */}
                    {tasks.length === 0 ? (
                        <div style={{ 
                            textAlign: "center", 
                            padding: "40px 20px", 
                            border: `2px dashed var(--border-color)`, 
                            backgroundColor: "var(--bg-secondary)",
                            borderRadius: "8px" 
                        }}>
                            <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
                                {searchQuery ? "🔍 Không tìm thấy task nào!" : "📭 Không có task nào!"}
                            </p>
                            <p style={{ color: "var(--text-secondary)", fontSize: "14px", opacity: 0.8 }}>
                                {searchQuery
                                    ? `Không có task nào khớp với "${searchQuery}". Thử từ khóa khác.`
                                    : filterPriority === "all"
                                        ? "Hãy tạo task đầu tiên ở form phía trên."
                                        : "Không có task với độ ưu tiên đã chọn."}
                            </p>
                            {searchQuery && (
                                <button
                                    onClick={() => handleSearch("")}
                                    style={{
                                        marginTop: "10px", padding: "6px 16px",
                                        backgroundColor: "var(--accent-blue)",
                                        color: "#fff", border: "none",
                                        borderRadius: "4px", cursor: "pointer"
                                    }}
                                >
                                    Xóa tìm kiếm
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                {tasks.map((task) => {
                                    if (editingTaskId === task.id) {
                                        return (
                                            <div
                                                key={task.id}
                                                style={{
                                                    padding: "15px",
                                                    border: `1px solid var(--accent-blue)`, 
                                                    borderRadius: "6px",
                                                    backgroundColor: "var(--bg-card)",
                                                    borderLeft: "6px solid var(--accent-blue)"
                                                }}
                                            >
                                                <EditableTask
                                                    task={task}
                                                    onSave={(updatedData) => handleEditSave(task.id, updatedData)}
                                                    onCancel={() => setEditingTaskId(null)}
                                                />
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={task.id}
                                            style={{
                                                padding: "15px",
                                                border: `1px solid var(--border-color)`,
                                                borderRadius: "6px",
                                                backgroundColor: task.status === "completed"
                                                    ? (isDark ? "#1a2e1a" : "#e2f0d9")  
                                                    : "var(--bg-card)",
                                                borderLeft: task.priority === "high"   ? "6px solid var(--accent-red)" :
                                                            task.priority === "medium" ? "6px solid var(--accent-yellow)" :
                                                                                         "6px solid var(--accent-green)"
                                            }}
                                        >
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ 
                                                        margin: "0 0 8px 0", 
                                                        textDecoration: task.status === "completed" ? "line-through" : "none",
                                                        color: "var(--text-primary)"
                                                    }}>
                                                        {task.title}
                                                    </h4>

                                                    {/* Badge row */}
                                                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                                                        {task.priority && (() => {
                                                            const p = getPriorityConfig(task.priority);
                                                            return (
                                                                <span style={{ padding: "2px 8px", fontSize: "11px", borderRadius: "12px", backgroundColor: p.bg, color: p.color, fontWeight: "600" }}>
                                                                    {p.label}
                                                                </span>
                                                            );
                                                        })()}

                                                        {task.category && (() => {
                                                            const c = getCategoryConfig(task.category);
                                                            return (
                                                                <span style={{ padding: "2px 8px", fontSize: "11px", borderRadius: "12px", backgroundColor: c.bg, color: "#333" }}>
                                                                    {c.label}
                                                                </span>
                                                            );
                                                        })()}

                                                        <span style={{ padding: "2px 8px", fontSize: "11px", borderRadius: "12px", backgroundColor: task.status === "completed" ? "var(--accent-green)" : "#6c757d", color: "#fff" }}>
                                                            {task.status === "completed" ? "✅ Hoàn thành" : "⏳ Đang làm"}
                                                        </span>
                                                    </div>

                                                    <div style={{ marginBottom: "8px" }}>
                                                        <DeadlineBadge deadline={task.deadline} />
                                                    </div>

                                                    <p style={{ margin: "0 0 6px 0", color: "var(--text-secondary)", fontSize: "14px" }}>
                                                        {task.description || "Không có mô tả"}
                                                    </p>

                                                    {task.ai_notes && (
                                                        <p style={{ 
                                                            margin: "0", 
                                                            fontSize: "12px", 
                                                            color: "var(--accent-purple)", 
                                                            fontStyle: "italic", 
                                                            padding: "4px 8px", 
                                                            backgroundColor: isDark ? "#2d1b4e" : "#f3e8ff", 
                                                            borderRadius: "4px" 
                                                        }}>
                                                            🤖 {task.ai_notes}
                                                        </p>
                                                    )}
                                                </div>

                                                <div style={{ display: "flex", gap: "8px", marginLeft: "10px" }}>
                                                    {task.status !== "completed" && (
                                                        <>
                                                            <button
                                                                onClick={() => setEditingTaskId(task.id)}
                                                                style={{ padding: "5px 10px", backgroundColor: "var(--accent-purple)", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                                                            >
                                                                Sửa
                                                            </button>
                                                            <button
                                                                onClick={() => handleCompleteTask(task)}
                                                                style={{ padding: "5px 10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                                                            >
                                                                Complete
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteTask(task.id)}
                                                        style={{ padding: "5px 10px", backgroundColor: "var(--accent-red)", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>

                                            <AttachmentSection taskId={task.id} />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            <Pagination
                                pagination={pagination}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </section>
            </div>
        </MainLayout>
    );
}

export default DashboardPage;