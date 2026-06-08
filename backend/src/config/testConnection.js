const pool = require("./database");

async function testConnection() {
  try {
    // Chạy một câu lệnh SQL cơ bản lấy thời gian hiện tại của DB
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Kết nối PostgreSQL THÀNH CÔNG!");
    console.log("Thời gian hiện tại của Hệ thống DB là:", result.rows[0].now);
  } catch (error) {
    console.error("❌ Kết nối PostgreSQL THẤT BẠI!");
    console.error("Chi tiết lỗi:", error.message);
  } finally {
    // Đóng kết nối sau khi test xong để không làm treo Terminal
    await pool.end();
  }
}

testConnection();