const taskService = require('./task.service');
const notificationService = require("../notification/notification.service");

/**
 * Điều phối Tạo mới Task
 */
async function createTask(req, res) {
  try {
    const { title, description, assignedTo, deadline } = req.body;
    const userId = req.user.id;
    const targetUserId = (assignedTo && assignedTo !== "" && assignedTo !== "0")
      ? parseInt(assignedTo)
      : userId;

    console.log("📦 req.body:", req.body);

    const task = await taskService.createTask(
      title, description, userId, targetUserId,
      deadline || null  // ← thêm deadline
    );

    req.io.to(`user_${targetUserId}`).emit("task-created", task);

    if (targetUserId !== userId) {
      await notificationService.createAndPushNotification(req.io, {
        userId: targetUserId,
        title: "Bạn được giao công việc mới",
        message: `${req.user.email} đã giao cho bạn task: "${title}"`,
        type: "task_assigned",
        relatedTaskId: task.id
      });
    }

    return res.status(201).json({ success: true, data: task });
  } catch (error) {
    console.error("❌ Lỗi createTask:", error);
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message
    });
  }
}

/**
 * Điều phối Lấy danh sách Task của chính user đang đăng nhập
 */
async function getTasks(req, res) {
  try {
    const userId = req.user.id;
    const role = req.user.role; // ← lấy role từ JWT
    const tasks = await taskService.getTasks(userId, role);
    return res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi lấy danh sách công việc."
    });
  }
}

/**
 * Điều phối Cập nhật thông tin Task
 */
async function updateTask(req, res) {
  try {
    const taskId = req.params.id;
    const { title, description, status, deadline } = req.body;
    const userId = req.user.id;

    const updatedTask = await taskService.updateTask(
      taskId, title, description, status, userId,
      deadline || null  // ← thêm deadline
    );

    req.io.emit("task-updated", updatedTask);

    return res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message
    });
  }
}

async function deleteTask(req, res) {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    await taskService.deleteTask(taskId, userId);

    // Emit sự kiện xóa — gửi kèm id để frontend biết xóa task nào
    req.io.to(`user_${userId}`).emit("task-deleted", { id: taskId });

    return res.status(200).json({ success: true, message: "Xóa công việc thành công." });
  } catch (error) {
    return res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
}

/**
 * Lấy tasks có pagination
 * GET /api/tasks?page=1&limit=5&priority=all
 */
async function getTasksPaginated(req, res) {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const priority = req.query.priority || "all";
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "priority";       // ← thêm
    const sortOrder = req.query.sortOrder || "asc";      // ← thêm

    const result = await taskService.getTasksPaginated(
      userId, role, page, limit, priority, search, sortBy, sortOrder
    );

    return res.status(200).json({
      success: true,
      data: result.tasks,
      pagination: result.pagination
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi lấy danh sách công việc."
    });
  }
}

// Thêm vào module.exports
module.exports = {
  createTask,
  getTasks,
  getTasksPaginated, 
  updateTask,
  deleteTask
};