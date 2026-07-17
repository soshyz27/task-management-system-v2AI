const pool = require("../../config/database");

async function getAllUsers() {
  const result = await pool.query(
    `SELECT id, username, email, role, created_at
     FROM users
     ORDER BY created_at DESC`
  );
  return result.rows;
}

async function getUserById(id) {
  const result = await pool.query(
    `SELECT id, username, email, role, created_at
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

async function updateUserRole(id, role) {
  const result = await pool.query(
    `UPDATE users SET role = $1
     WHERE id = $2
     RETURNING id, username, email, role`,
    [role, id]
  );
  return result.rows[0];
}

async function deleteUser(id) {
  await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
}

async function getAllTasks() {
  const result = await pool.query(
    `SELECT t.id, t.title, t.description, t.status,
            t.created_at, u.username, u.email
     FROM tasks t
     JOIN users u ON t.user_id = u.id
     ORDER BY t.created_at DESC`
  );
  return result.rows;
}

/**
 * Lấy thông tin profile của user theo id
 */
async function getUserById(id) {
  const result = await pool.query(
    `SELECT id, username, email, role, created_at
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

/**
 * Cập nhật username
 */
async function updateUsername(id, username) {
  const result = await pool.query(
    `UPDATE users SET username = $1
     WHERE id = $2
     RETURNING id, username, email, role, created_at`,
    [username, id]
  );
  return result.rows[0];
}

/**
 * Cập nhật password (đã hash)
 */
async function updatePassword(id, hashedPassword) {
  await pool.query(
    `UPDATE users SET password = $1 WHERE id = $2`,
    [hashedPassword, id]
  );
}

/**
 * Lấy password hiện tại để verify
 */
async function getPasswordById(id) {
  const result = await pool.query(
    `SELECT password FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0]?.password;
}

/**
 * Lấy thống kê task của user
 */
async function getUserTaskStats(id) {
  const result = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE user_id = $1 OR assigned_to = $1) as total,
       COUNT(*) FILTER (WHERE (user_id = $1 OR assigned_to = $1) AND status = 'completed') as completed,
       COUNT(*) FILTER (WHERE (user_id = $1 OR assigned_to = $1) AND status = 'pending') as pending,
       COUNT(*) FILTER (WHERE (user_id = $1 OR assigned_to = $1) AND priority = 'high' AND status = 'pending') as high_pending,
       COUNT(*) FILTER (WHERE (user_id = $1 OR assigned_to = $1) AND deadline < NOW() AND status = 'pending') as overdue
     FROM tasks`,
    [id]
  );
  return result.rows[0];
}

module.exports = { getAllUsers, getUserById, updateUserRole, deleteUser, getAllTasks, updateUsername, updatePassword, getPasswordById, getUserTaskStats };