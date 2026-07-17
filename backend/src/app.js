const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./modules/auth/auth.route");
const taskRoutes = require("./modules/task/task.route");
const userRoutes = require("./modules/user/user.route");
const profileRoutes = require("./modules/user/profile.route");
const notificationRoutes = require("./modules/notification/notification.route");
const aiRoutes = require("./modules/ai/ai.route");
console.log("✅ AI routes loaded");

const { checkDeadlineReminders } = require("./services/reminderService");

const app = express();
const server = http.createServer(app);

// --- Cấu hình CORS chung ở một nơi ---
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://task-management-system-eight-rouge.vercel.app"
];

// Khởi tạo Socket.IO với config CORS
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
  }
});

// --- Middleware ---
app.use(cors({
  origin: ALLOWED_ORIGINS,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Gắn io vào req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/profile", profileRoutes); // Đã bao gồm các route bên trong profile.route.js

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running perfectly!", timestamp: new Date() });
});

// --- Socket.IO connection handling ---
io.on("connection", (socket) => {
  console.log(`🔌 Client kết nối: ${socket.id}`);

  socket.on("join", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} đã join room user_${userId}`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client ngắt kết nối: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

checkDeadlineReminders(io);

const SIX_HOURS = 6 * 60 * 60 * 1000;
setInterval(() => checkDeadlineReminders(io), SIX_HOURS);
console.log("⏰ Deadline reminder service đã khởi động");

server.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 Server đang chạy thành công tại Port: ${PORT}`);
  console.log(`🔌 Socket.IO đã sẵn sàng`);
  console.log(`=============================================`);
});