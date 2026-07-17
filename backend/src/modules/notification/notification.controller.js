const notificationService = require("./notification.service");

async function getNotifications(req, res) {
  try {
    const notifications = await notificationService.getNotifications(req.user.id);
    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getUnreadCount(req, res) {
  try {
    const count = await notificationService.getUnreadCount(req.user.id);
    return res.status(200).json({ success: true, data: { count } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function markAsRead(req, res) {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function markAllAsRead(req, res) {
  try {
    await notificationService.markAllAsRead(req.user.id);
    return res.status(200).json({ success: true, message: "Đã đánh dấu tất cả đã đọc." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getNotifications, getUnreadCount, markAsRead, markAllAsRead };