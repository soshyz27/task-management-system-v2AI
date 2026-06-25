const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Đảm bảo các biến môi trường từ .env được nạp đầu tiên

//Import bộ định tuyến Auth ---
const authRoutes = require("./routes/authRoutes");
// --- Import bộ định tuyến Task ---
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// --- 1. Cấu hình Middleware hệ thống ---
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://task-management-system-eight-rouge.vercel.app" // Điền chính xác link Vercel này
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json()); // Cho phép Express đọc và hiểu dữ liệu JSON gửi lên từ client (req.body)

// ---  Import người gác cổng ---
const authenticate = require("./middleware/authMiddleware");

// Đăng ký tuyến đường vào ứng dụng ---
app.use("/api/auth", authRoutes);
// --- Đăng ký cụm API tasks ---
app.use("/api/tasks", taskRoutes);

// --- Tuyến đường được bảo vệ (Protected Route) ---
app.get("/api/profile", authenticate, (req, res) => {
  // Nhờ có middleware, thông tin user đã nằm sẵn trong req.user
  res.status(200).json({
    success: true,
    message: "Bạn đã truy cập vào khu vực bảo mật thành công!",
    user: req.user
  });
});


// --- 2. Định nghĩa API kiểm tra trạng thái (Health Check) ---
// API này giúp chúng ta biết Server có đang sống và hoạt động bình thường hay không
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running perfectly!",
    timestamp: new Date()
  });
});

// --- 3. Kích hoạt Server lắng nghe các yêu cầu ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 Server đang chạy thành công tại Port: ${PORT}`);
  console.log(`👉 API Health Check: http://localhost:${PORT}/health`);
  console.log(`=============================================`);
});