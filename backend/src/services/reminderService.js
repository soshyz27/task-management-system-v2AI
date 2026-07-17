const pool = require("../config/database");
const notificationRepository = require("../modules/notification/notification.repository");

/**
 * Chạy mỗi ngày 1 lần — kiểm tra task sắp deadline và gửi reminder
 */
async function checkDeadlineReminders(io) {
  console.log("⏰ Đang kiểm tra deadline reminders...");

  try {
    // Lấy các task pending có deadline trong vòng 2 ngày tới
    const result = await pool.query(
      `SELECT t.id, t.title, t.deadline,
              t.user_id, t.assigned_to,
              u.email as owner_email
       FROM tasks t
       JOIN users u ON t.user_id = u.id
       WHERE t.status = 'pending'
         AND t.deadline IS NOT NULL
         AND t.deadline <= NOW() + INTERVAL '2 days'
         AND t.deadline >= NOW()
       ORDER BY t.deadline ASC`
    );

    console.log(`📋 Tìm thấy ${result.rows.length} task sắp deadline`);

    for (const task of result.rows) {
      const hoursLeft = Math.floor(
        (new Date(task.deadline) - new Date()) / (1000 * 60 * 60)
      );

      const timeText = hoursLeft < 24
        ? `còn ${hoursLeft} giờ`
        : `còn ${Math.floor(hoursLeft / 24)} ngày`;

      // Gửi reminder cho chủ task
      const notification = await notificationRepository.createNotification({
        userId: task.user_id,
        title: "⏰ Nhắc nhở deadline",
        message: `Task "${task.title}" sẽ hết hạn sau ${timeText}!`,
        type: "deadline_reminder",
        relatedTaskId: task.id
      });

      // Push real-time
      if (io) {
        io.to(`user_${task.user_id}`).emit("new-notification", notification);
      }

      // Nếu task được giao cho người khác → nhắc cả người được giao
      if (task.assigned_to && task.assigned_to !== task.user_id) {
        const assigneeNotification = await notificationRepository.createNotification({
          userId: task.assigned_to,
          title: "⏰ Nhắc nhở deadline",
          message: `Task "${task.title}" được giao cho bạn sẽ hết hạn sau ${timeText}!`,
          type: "deadline_reminder",
          relatedTaskId: task.id
        });

        if (io) {
          io.to(`user_${task.assigned_to}`).emit("new-notification", assigneeNotification);
        }
      }

      console.log(`✅ Đã gửi reminder cho task: ${task.title} (${timeText})`);
    }
  } catch (error) {
    console.error("❌ Lỗi checkDeadlineReminders:", error.message);
  }
}

module.exports = { checkDeadlineReminders };