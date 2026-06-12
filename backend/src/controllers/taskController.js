const taskService = require("../services/taskService");

/**
 * Điều phối Tạo mới Task
 */
async function createTask(req, res) {
  try {
    const { title, description } = req.body;
    const userId = req.user.id; // Lấy từ token đã được giải mã bởi middleware

    const task = await taskService.createTask(title, description, userId);

    return res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
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
    const tasks = await taskService.getTasks(userId);

    return res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi hệ thống khi lấy danh sách công việc."
    });
  }
}

/**
 * Điều phối Cập nhật thông tin Task
 */
async function updateTask(req, res) {
  try {
    const taskId = req.params.id;
    const { title, description, status } = req.body;
    const userId = req.user.id;

    const updatedTask = await taskService.updateTask(taskId, title, description, status, userId);

    return res.status(200).json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    // Trả về chính xác mã lỗi 400, 403 hoặc 404 tùy theo lỗi do Service ném ra
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message
    });
  }
}

/**
 * Điều phối Xóa vĩnh viễn Task
 */
async function deleteTask(req, res) {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    await taskService.deleteTask(taskId, userId);

    return res.status(200).json({
      success: true,
      message: "Xóa công việc thành công."
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};