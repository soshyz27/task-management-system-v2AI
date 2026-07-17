const pool = require("../../config/database");

async function createTask(title, description, userId, assignedTo, priority = "medium", category = "other", aiNotes = "", deadline = null) {
  const result = await pool.query(
    `INSERT INTO tasks (title, description, status, user_id, assigned_to, priority, category, ai_notes, deadline)
     VALUES ($1, $2, 'pending', $3, $4, $5, $6, $7, $8)
     RETURNING id, title, description, status, user_id, assigned_to, priority, category, ai_notes, deadline, created_at`,
    [title, description, userId, assignedTo, priority, category, aiNotes, deadline]
  );
  return result.rows[0];
}

async function getTasksByUser(userId) {
  const result = await pool.query(
    `SELECT id, title, description, status, priority, category, ai_notes, deadline, created_at
     FROM tasks
     WHERE user_id = $1 OR assigned_to = $1
     ORDER BY
       CASE priority
         WHEN 'high' THEN 1
         WHEN 'medium' THEN 2
         WHEN 'low' THEN 3
       END,
       created_at DESC`,
    [userId]
  );
  return result.rows;
}

async function getTaskById(id) {
  const result = await pool.query(
    `SELECT id, title, description, status, user_id, assigned_to,
            priority, category, ai_notes, deadline, created_at
     FROM tasks WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

async function updateTask(id, title, description, status, deadline = null) {
  const result = await pool.query(
    `UPDATE tasks
     SET title = $1, description = $2, status = $3, deadline = $4
     WHERE id = $5
     RETURNING id, title, description, status, user_id, assigned_to,
               priority, category, ai_notes, deadline, created_at`,
    [title, description, status, deadline, id]
  );
  return result.rows[0];
}

async function deleteTask(id) {
  await pool.query(`DELETE FROM tasks WHERE id = $1`, [id]);
}

async function getAllTasks() {
  const result = await pool.query(
    `SELECT t.id, t.title, t.description, t.status,
            t.priority, t.category, t.ai_notes,
            t.created_at, u.username, u.email
     FROM tasks t
     JOIN users u ON t.user_id = u.id
     ORDER BY
       CASE t.priority
         WHEN 'high' THEN 1
         WHEN 'medium' THEN 2
         WHEN 'low' THEN 3
       END,
       t.created_at DESC`
  );
  return result.rows;
}

/**
 * Lấy tasks theo trang với tổng số lượng (Đã cập nhật Sort)
 */
async function getTasksByUserPaginated(userId, page = 1, limit = 5, priority = "all", search = "", sortBy = "priority", sortOrder = "asc") {
  const offset = (page - 1) * limit;
  const hasSearch = search.trim() !== "";
  const hasPriority = priority !== "all";

  // Build điều kiện động
  const conditions = ["(user_id = $1 OR assigned_to = $1)"];
  const params = [userId];

  if (hasPriority) {
    params.push(priority);
    conditions.push(`priority = $${params.length}`);
  }

  if (hasSearch) {
    params.push(`%${search.trim()}%`);
    conditions.push(`(LOWER(title) LIKE LOWER($${params.length}) OR LOWER(description) LIKE LOWER($${params.length}))`);
  }

  const whereClause = conditions.join(" AND ");
  
  // Sử dụng helper để sinh câu lệnh ORDER BY động an toàn
  const orderClause = buildOrderClause(sortBy, sortOrder); 

  // Query lấy tasks
  const dataParams = [...params, limit, offset];
  const result = await pool.query(
    `SELECT id, title, description, status, priority, category,
            ai_notes, deadline, created_at
     FROM tasks
     WHERE ${whereClause}
     ORDER BY ${orderClause} -- Thay thế ORDER BY tĩnh thành động
     LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
    dataParams
  );

  // Query đếm tổng — dùng cùng params (không có limit/offset)
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM tasks WHERE ${whereClause}`,
    params
  );

  const total = parseInt(countResult.rows[0].count);

  return {
    tasks: result.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
}

/**
 * Admin lấy tất cả tasks theo trang (Đã cập nhật Sort)
 */
async function getAllTasksPaginated(page = 1, limit = 5, priority = "all", search = "", sortBy = "priority", sortOrder = "asc") {
  const offset = (page - 1) * limit;
  const hasSearch = search.trim() !== "";
  const hasPriority = priority !== "all";

  const conditions = ["1=1"];
  const params = [];

  if (hasPriority) {
    params.push(priority);
    conditions.push(`t.priority = $${params.length}`);
  }

  if (hasSearch) {
    params.push(`%${search.trim()}%`);
    conditions.push(`(LOWER(t.title) LIKE LOWER($${params.length}) OR LOWER(t.description) LIKE LOWER($${params.length}))`);
  }

  const whereClause = conditions.join(" AND ");
  
  // Sử dụng helper với tiền tố table alias "t"
  const orderClause = buildOrderClause(sortBy, sortOrder, "t");

  const dataParams = [...params, limit, offset];
  const result = await pool.query(
    `SELECT t.id, t.title, t.description, t.status,
            t.priority, t.category, t.ai_notes,
            t.deadline, t.created_at, u.username, u.email
     FROM tasks t
     JOIN users u ON t.user_id = u.id
     WHERE ${whereClause}
     ORDER BY ${orderClause} -- Thay thế ORDER BY tĩnh thành động
     LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
    dataParams
  );

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM tasks t WHERE ${whereClause}`,
    params
  );

  const total = parseInt(countResult.rows[0].count);

  return {
    tasks: result.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
}

/**
 * Helper build ORDER BY clause an toàn (chống SQL injection)
 */
function buildOrderClause(sortBy, sortOrder, prefix = "") {
  const p = prefix ? `${prefix}.` : "";
  const order = sortOrder === "desc" ? "DESC" : "ASC";

  // Whitelist các cột được phép sort — chống SQL injection
  const allowedSortBy = ["priority", "created_at", "deadline", "title", "status"];
  const safeSortBy = allowedSortBy.includes(sortBy) ? sortBy : "priority";

  switch (safeSortBy) {
    case "priority":
      return `CASE ${p}priority
                WHEN 'high' THEN 1
                WHEN 'medium' THEN 2
                WHEN 'low' THEN 3
              END ${order}, ${p}created_at DESC`;

    case "deadline":
      // NULL deadline xuống cuối
      return order === "ASC"
        ? `${p}deadline IS NULL ASC, ${p}deadline ASC`
        : `${p}deadline IS NULL ASC, ${p}deadline DESC`;

    case "created_at":
      return `${p}created_at ${order}`;

    case "title":
      return `LOWER(${p}title) ${order}`;

    case "status":
      // pending trước, completed sau (ASC) hoặc ngược lại
      return `CASE ${p}status
                WHEN 'pending' THEN 1
                WHEN 'completed' THEN 2
              END ${order}`;

    default:
      return `${p}created_at DESC`;
  }
}

// Thêm vào module.exports
module.exports = {
  createTask,
  getTasksByUser,
  getTasksByUserPaginated, 
  getTaskById,
  updateTask,
  deleteTask,
  getAllTasks,
  getAllTasksPaginated,
  buildOrderClause  
};