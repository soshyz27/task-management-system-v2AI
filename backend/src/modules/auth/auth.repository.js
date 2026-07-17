const pool = require("../../config/database");

/**
 * Tìm kiếm người dùng dựa vào email
 * @param {string} email 
 * @returns {Object|null} Trả về thông tin user hoặc undefined nếu không tìm thấy
 */
async function findByEmail(email) {
  const result = await pool.query(
    `SELECT id, username, email, password, role, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );
  return result.rows[0];
}

/**
 * Tạo một người dùng mới vào Database
 * @param {string} username 
 * @param {string} email 
 * @param {string} hashedPassword 
 * @returns {Object} Thông tin người dùng vừa tạo
 */
async function createUser(username, email, hashedPassword) {
  const result = await pool.query(
    `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, created_at
    `,
    [username, email, hashedPassword]
  );
  return result.rows[0];
}

module.exports = {
  findByEmail,
  createUser
};