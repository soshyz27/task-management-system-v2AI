const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  // 1. Lấy chuỗi Authorization từ Header gửi lên
  const authHeader = req.headers.authorization;

  // Kiểm tra xem Header có tồn tại và có bắt đầu bằng chữ "Bearer " không
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Truy cập bị từ chối. Token bị thiếu hoặc không hợp lệ."
    });
  }

  // 2. Cắt bỏ chữ "Bearer " để lấy chuỗi Token nguyên bản
  const token = authHeader.split(" ")[1];

  try {
    // 3. Tiến hành giải mã Token bằng mã bí mật hệ thống
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Đính kèm thông tin user đã giải mã (id, email) vào đối tượng req
    req.user = decoded;

    // Cho phép request tiếp tục đi tới Controller tiếp theo
    next();
  } catch (error) {
    // Nếu token hết hạn hoặc bị sửa đổi, trả về lỗi 401 ngay lập tức
    return res.status(401).json({
      success: false,
      message: "Mã xác thực không hợp lệ hoặc đã hết hạn."
    });
  }
}

module.exports = authenticate;