const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Đảm bảo các biến môi trường từ .env được nạp đầu tiên

const app = express();

// --- 1. Cấu hình Middleware hệ thống ---
app.use(cors()); // Cho phép Frontend truy cập API từ các port khác nhau
app.use(express.json()); // Cho phép Express đọc và hiểu dữ liệu JSON gửi lên từ client (req.body)

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