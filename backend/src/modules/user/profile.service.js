const bcrypt = require("bcrypt");
const userRepository = require("./user.repository");

/**
 * Lấy thông tin profile + thống kê task
 */
async function getProfile(userId) {
  const user = await userRepository.getUserById(userId);
  if (!user) {
    const error = new Error("Không tìm thấy người dùng.");
    error.statusCode = 404;
    throw error;
  }

  const stats = await userRepository.getUserTaskStats(userId);

  return {
    ...user,
    stats: {
      total: parseInt(stats.total),
      completed: parseInt(stats.completed),
      pending: parseInt(stats.pending),
      highPending: parseInt(stats.high_pending),
      overdue: parseInt(stats.overdue),
      completionRate: stats.total > 0
        ? Math.round((stats.completed / stats.total) * 100)
        : 0
    }
  };
}

/**
 * Cập nhật username
 */
async function updateUsername(userId, newUsername) {
  if (!newUsername || newUsername.trim().length < 3) {
    const error = new Error("Username phải có ít nhất 3 ký tự.");
    error.statusCode = 400;
    throw error;
  }

  if (newUsername.trim().length > 50) {
    const error = new Error("Username tối đa 50 ký tự.");
    error.statusCode = 400;
    throw error;
  }

  return await userRepository.updateUsername(userId, newUsername.trim());
}

/**
 * Đổi mật khẩu
 */
async function changePassword(userId, currentPassword, newPassword) {
  if (!currentPassword || !newPassword) {
    const error = new Error("Vui lòng nhập đầy đủ mật khẩu.");
    error.statusCode = 400;
    throw error;
  }

  if (newPassword.length < 6) {
    const error = new Error("Mật khẩu mới phải có ít nhất 6 ký tự.");
    error.statusCode = 400;
    throw error;
  }

  if (currentPassword === newPassword) {
    const error = new Error("Mật khẩu mới không được trùng mật khẩu cũ.");
    error.statusCode = 400;
    throw error;
  }

  // Verify mật khẩu hiện tại
  const hashedPassword = await userRepository.getPasswordById(userId);
  const isMatch = await bcrypt.compare(currentPassword, hashedPassword);

  if (!isMatch) {
    const error = new Error("Mật khẩu hiện tại không đúng.");
    error.statusCode = 400;
    throw error;
  }

  // Hash mật khẩu mới
  const newHashed = await bcrypt.hash(newPassword, 10);
  await userRepository.updatePassword(userId, newHashed);
}

module.exports = { getProfile, updateUsername, changePassword };