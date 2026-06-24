const { Pool } = require("pg");
require("dotenv").config();

let pool;

// Nếu có chuỗi DATABASE_URL (Khi chạy trên Cloud Render), ưu tiên dùng connectionString
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      // Bắt buộc sử dụng SSL mã hóa nhưng bỏ qua xác thực chứng chỉ tự ký trên môi trường Cloud miễn phí
      rejectUnauthorized: false
    }
  });
} else {
  // Dự phòng: Nếu chạy ở máy cá nhân (Local), hệ thống tự động đọc từng biến đơn lẻ cũ của bạn
  pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
}

// Kiểm tra kết nối ban đầu
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Lỗi kết nối Database Pool:", err.message);
  } else {
    console.log("✅ Kết nối Cơ sở dữ liệu PostgreSQL thành công!");
    release();
  }
});

module.exports = pool;