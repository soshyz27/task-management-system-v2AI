const pool = require("../../config/database");

/**
 * Lưu thông tin file vào database
 */
async function createAttachment({ filename, originalname, filepath, mimetype, filesize, taskId, uploadedBy }) {
  const result = await pool.query(
    `INSERT INTO attachments (filename, originalname, filepath, mimetype, filesize, task_id, uploaded_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, filename, originalname, filepath, mimetype, filesize, task_id, created_at`,
    [filename, originalname, filepath, mimetype, filesize, taskId, uploadedBy]
  );
  return result.rows[0];
}

/**
 * Lấy tất cả file đính kèm của một task
 */
async function getAttachmentsByTask(taskId) {
  const result = await pool.query(
    `SELECT a.id, a.filename, a.originalname, a.mimetype, a.filesize, a.created_at,
            u.username as uploaded_by
     FROM attachments a
     JOIN users u ON a.uploaded_by = u.id
     WHERE a.task_id = $1
     ORDER BY a.created_at DESC`,
    [taskId]
  );
  return result.rows;
}

/**
 * Lấy thông tin một file theo id (để download/xóa)
 */
async function getAttachmentById(id) {
  const result = await pool.query(
    `SELECT * FROM attachments WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

/**
 * Xóa record file khỏi database
 */
async function deleteAttachment(id) {
  await pool.query(`DELETE FROM attachments WHERE id = $1`, [id]);
}

module.exports = {
  createAttachment,
  getAttachmentsByTask,
  getAttachmentById,
  deleteAttachment
};