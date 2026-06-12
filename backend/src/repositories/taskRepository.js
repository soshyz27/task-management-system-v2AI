const pool = require("../config/database");

/**
 * Tạo mới một Task
 */
async function createTask(title, description, userId) {
  const result = await pool.query(
    `
    INSERT INTO tasks (title, description, status, user_id)
    VALUES ($1, $2, 'pending', $3)
    RETURNING id, title, description, status, user_id, created_at
    `,
    [title, description, userId]
  );
  return result.rows[0];
}

/**
 * Lấy toàn bộ danh sách Task của một User cụ thể
 */
async function getTasksByUser(userId) {
  const result = await pool.query(
    `
    SELECT id, title, description, status, created_at
    FROM tasks
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );
  return result.rows;
}

/**
 * Lấy chi tiết một Task bằng ID (Dùng để kiểm tra dữ liệu gốc)
 */
async function getTaskById(id) {
  const result = await pool.query(
    `
    SELECT id, title, description, status, user_id, created_at
    FROM tasks
    WHERE id = $1
    `,
    [id]
  );
  return result.rows[0];
}

/**
 * Cập nhật thông tin chi tiết của Task
 */
async function updateTask(id, title, description, status) {
  const result = await pool.query(
    `
    UPDATE tasks
    SET title = $1, description = $2, status = $3
    WHERE id = $4
    RETURNING id, title, description, status, user_id, created_at
    `,
    [title, description, status, id]
  );
  return result.rows[0];
}

/**
 * Xóa vĩnh viễn một Task khỏi hệ thống
 */
async function deleteTask(id) {
  await pool.query(
    `
    DELETE FROM tasks
    WHERE id = $1
    `,
    [id]
  );
}

module.exports = {
  createTask,
  getTasksByUser,
  getTaskById,
  updateTask,
  deleteTask
};