const { Pool } = require("pg");
require("dotenv").config(); // Nạp các biến môi trường từ file .env

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Lắng nghe sự kiện kết nối thành công để tiện theo dõi
pool.on("connect", () => {
  console.log("Database pool đã được khởi tạo thành công.");
});

module.exports = pool;