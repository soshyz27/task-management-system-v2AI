const notificationRepository = require("./notification.repository");

async function createAndPushNotification(io, { userId, title, message, type, relatedTaskId }) {
  // Lưu vào DB
  const notification = await notificationRepository.createNotification({
    userId, title, message, type, relatedTaskId
  });

  // Đẩy real-time tới đúng user qua room riêng
  io.to(`user_${userId}`).emit("new-notification", notification);

  return notification;
}

async function getNotifications(userId) {
  return await notificationRepository.getNotificationsByUser(userId);
}

async function getUnreadCount(userId) {
  return await notificationRepository.getUnreadCount(userId);
}

async function markAsRead(id, userId) {
  return await notificationRepository.markAsRead(id, userId);
}

async function markAllAsRead(userId) {
  return await notificationRepository.markAllAsRead(userId);
}

module.exports = {
  createAndPushNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
};