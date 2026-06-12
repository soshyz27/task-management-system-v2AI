const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authenticate = require("../middleware/authMiddleware");

// ÁP DỤNG BẢO MẬT: Tất cả các route khai báo phía dưới dòng này 
// đều bắt buộc phải đi qua người gác cổng authenticate (JWT check)
router.use(authenticate);

// Cấu hình định tuyến CRUD
router.get("/", taskController.getTasks);       // GET /api/tasks -> Lấy danh sách
router.post("/", taskController.createTask);     // POST /api/tasks -> Tạo mới
router.put("/:id", taskController.updateTask);   // PUT /api/tasks/:id -> Cập nhật
router.delete("/:id", taskController.deleteTask);// DELETE /api/tasks/:id -> Xóa

module.exports = router;