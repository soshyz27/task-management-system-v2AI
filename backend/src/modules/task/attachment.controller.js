const path = require("path");
const fs = require("fs");
const attachmentRepository = require("./attachment.repository");
const taskRepository = require("./task.repository");
const notificationService = require("../notification/notification.service");

/**
 * Upload file đính kèm cho task
 */
async function uploadFile(req, res) {
  try {
    // Multer đã xử lý file, thông tin nằm trong req.file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Không có file nào được tải lên."
      });
    }

    const taskId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Kiểm tra task tồn tại
    const task = await taskRepository.getTaskById(taskId);
    if (!task) {
      // Xóa file vừa upload nếu task không tồn tại
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy task."
      });
    }

    // Kiểm tra quyền: chỉ chủ task hoặc admin mới được upload
    if (userRole !== "admin" && parseInt(task.user_id) !== parseInt(userId)) {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền đính kèm file vào task này."
      });
    }

    // Lưu thông tin file vào database
    const attachment = await attachmentRepository.createAttachment({
      filename: req.file.filename,
      originalname: req.file.originalname,
      filepath: req.file.path,
      mimetype: req.file.mimetype,
      filesize: req.file.size,
      taskId,
      uploadedBy: userId
    });

    return res.status(201).json({
      success: true,
      data: attachment,
      message: "Upload file thành công."
    });

  } catch (error) {
    // Xóa file nếu có lỗi xảy ra
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi hệ thống khi upload file."
    });
  }
}

/**
 * Lấy danh sách file đính kèm của task
 */
async function getAttachments(req, res) {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    const task = await taskRepository.getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Không tìm thấy task." });
    }

    // Kiểm tra quyền xem
    if (userRole !== "admin" && parseInt(task.user_id) !== parseInt(userId)) {
      return res.status(403).json({ success: false, message: "Không có quyền xem task này." });
    }

    const attachments = await attachmentRepository.getAttachmentsByTask(taskId);
    return res.status(200).json({ success: true, data: attachments });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Download file
 */
async function downloadFile(req, res) {
  try {
    const attachmentId = req.params.attachmentId;
    const attachment = await attachmentRepository.getAttachmentById(attachmentId);

    if (!attachment) {
      return res.status(404).json({ success: false, message: "File không tồn tại." });
    }

    // Kiểm tra file có thực sự tồn tại trên disk không
    if (!fs.existsSync(attachment.filepath)) {
      return res.status(404).json({ success: false, message: "File đã bị xóa khỏi hệ thống." });
    }

    // Gửi file về client với tên gốc
    res.download(attachment.filepath, attachment.originalname);

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Xóa file đính kèm
 */
async function deleteFile(req, res) {
  try {
    const attachmentId = req.params.attachmentId;
    const userId = req.user.id;
    const userRole = req.user.role;

    const attachment = await attachmentRepository.getAttachmentById(attachmentId);
    if (!attachment) {
      return res.status(404).json({ success: false, message: "File không tồn tại." });
    }

    // Chỉ người upload hoặc admin mới được xóa
    if (userRole !== "admin" && parseInt(attachment.uploaded_by) !== parseInt(userId)) {
      return res.status(403).json({ success: false, message: "Không có quyền xóa file này." });
    }

    // Xóa file trên disk
    if (fs.existsSync(attachment.filepath)) {
      fs.unlinkSync(attachment.filepath);
    }

    // Xóa record trong database
    await attachmentRepository.deleteAttachment(attachmentId);

    return res.status(200).json({ success: true, message: "Xóa file thành công." });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { uploadFile, getAttachments, downloadFile, deleteFile };