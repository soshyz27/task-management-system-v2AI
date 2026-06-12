const taskRepository = require("../repositories/taskRepository");

/**
 * Helper nội bộ: Kiểm tra quyền sở hữu và sự tồn tại của Task
 * Đảm bảo User A không can thiệp được vào Task của User B
 */
async function verifyOwnership(taskId, userId) {
  const task = await taskRepository.getTaskById(taskId);

  if (!task) {
    const error = new Error("Không tìm thấy công việc yêu cầu.");
    error.statusCode = 404; // Gán mã lỗi để controller xử lý chính xác hơn
    throw error;
  }

  // Ép kiểu về Integer để so sánh tuyệt đối chính xác
  if (parseInt(task.user_id) !== parseInt(userId)) {
    const error = new Error("Bạn không có quyền thực hiện thao tác trên công việc này.");
    error.statusCode = 403; // Forbidden
    throw error;
  }

  return task;
}

/**
 * Tạo mới một công việc
 */
async function createTask(title, description, userId) {
  if (!title || title.trim() === "") {
    throw new Error("Tiêu đề công việc không được để trống.");
  }
  return await taskRepository.createTask(title, description, userId);
}

/**
 * Lấy danh sách công việc của User đang đăng nhập
 */
async function getTasks(userId) {
  return await taskRepository.getTasksByUser(userId);
}

/**
 * Cập nhật công việc kèm kiểm tra dữ liệu đầu vào và phân quyền
 */
async function updateTask(taskId, title, description, status, userId) {
  // 1. Kiểm tra quyền sở hữu trước khi làm bất cứ việc gì khác
  await verifyOwnership(taskId, userId);

  // 2. [CẢI TIẾN]: Validation trạng thái (Chỉ nhận pending hoặc completed)
  const validStatuses = ["pending", "completed"];
  if (status && !validStatuses.includes(status)) {
    const error = new Error("Trạng thái công việc không hợp lệ (Chỉ chấp nhận 'pending' hoặc 'completed').");
    error.statusCode = 400;
    throw error;
  }

  if (!title || title.trim() === "") {
    throw new Error("Tiêu đề công việc không được để trống.");
  }

  return await taskRepository.updateTask(taskId, title, description, status);
}

/**
 * Xóa công việc kèm phân quyền bảo mật
 */
async function deleteTask(taskId, userId) {
  // Kiểm tra quyền sở hữu trước khi xóa
  await verifyOwnership(taskId, userId);
  
  await taskRepository.deleteTask(taskId);
}

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};