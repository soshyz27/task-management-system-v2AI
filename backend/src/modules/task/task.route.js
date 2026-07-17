const express = require("express");
const router = express.Router();
const taskController = require("./task.controller");
const attachmentController = require("./attachment.controller");
const authenticate = require("../../middlewares/authMiddleware");
const upload = require("../../middlewares/upload");

router.use(authenticate);

// ── Task CRUD ──────────────────────────────────────
router.get("/", taskController.getTasks);
router.get("/paginated", taskController.getTasksPaginated);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

// ── Attachment ─────────────────────────────────────
// upload.single("file") — field name phải là "file" từ frontend
router.post("/:id/upload", upload.single("file"), attachmentController.uploadFile);
router.get("/:id/attachments", attachmentController.getAttachments);
router.get("/:id/attachments/:attachmentId/download", attachmentController.downloadFile);
router.delete("/:id/attachments/:attachmentId", attachmentController.deleteFile);

module.exports = router;