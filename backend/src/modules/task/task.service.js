const taskRepository = require("./task.repository");      
const notificationService = require("../notification/notification.service");
const aiService = require("../ai/ai.service");

async function verifyOwnership(taskId, userId) {
  const task = await taskRepository.getTaskById(taskId);

  if (!task) {
    const error = new Error("Không tìm thấy công việc yêu cầu.");
    error.statusCode = 404;
    throw error;
  }

  if (parseInt(task.user_id) !== parseInt(userId)) {
    const error = new Error("Bạn không có quyền thực hiện thao tác này.");
    error.statusCode = 403;
    throw error;
  }

  return task;
}

async function createTask(title, description, userId, assignedTo, deadline = null) {
  if (!title || title.trim() === "") {
    throw new Error("Tiêu đề công việc không được để trống.");
  }

  let priority = "medium";
  let category = "other";
  let aiNotes = "";

  try {
    const analysis = await aiService.analyzeTaskPriority(title, description);
    priority = analysis.priority;
    category = analysis.category;
    aiNotes = analysis.ai_notes;
    console.log(`🤖 AI phân tích: priority=${priority}, category=${category}`);
  } catch (err) {
    console.error("⚠️ AI phân tích thất bại:", err.message);
  }

  return await taskRepository.createTask(
    title, description, userId, assignedTo,
    priority, category, aiNotes, deadline
  );
}

async function getTasks(userId, role) {
  if (role === "admin") {
    return await taskRepository.getAllTasks();
  }
  return await taskRepository.getTasksByUser(userId);
}

async function updateTask(taskId, title, description, status, userId, deadline = null) {
  await verifyOwnership(taskId, userId);

  const validStatuses = ["pending", "completed"];
  if (status && !validStatuses.includes(status)) {
    const error = new Error("Trạng thái không hợp lệ.");
    error.statusCode = 400;
    throw error;
  }

  if (!title || title.trim() === "") {
    throw new Error("Tiêu đề không được để trống.");
  }

  return await taskRepository.updateTask(taskId, title, description, status, deadline);
}

async function deleteTask(taskId, userId) {
  await verifyOwnership(taskId, userId);
  await taskRepository.deleteTask(taskId);
}

/**
 * Lấy tasks có pagination + filter
 */
async function getTasksPaginated(userId, role, page, limit, priority, search = "", sortBy = "priority", sortOrder = "asc") {
  return await taskRepository.getTasksByUserPaginated(userId, page, limit, priority, search, sortBy, sortOrder);
}

// Thêm vào module.exports
module.exports = {
  createTask,
  getTasks,
  getTasksPaginated, 
  updateTask,
  deleteTask
};