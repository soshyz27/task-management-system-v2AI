const authService = require("./auth.service");

/**
 * Điều phối Đăng ký tài khoản
 */
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Ràng buộc bảo mật cốt lõi từ Blueprint: Đảm bảo dữ liệu đầu vào tối thiểu
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ các trường thông tin bắt buộc."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu phải có độ dài tối thiểu từ 6 ký tự."
      });
    }

    // Gọi Tầng Service xử lý logic nghiệp vụ
    const user = await authService.register(username, email, password);

    // Trả về kết quả thành công với HTTP Code 201 (Created)
    return res.status(201).json({
      success: true,
      data: user
    });

  } catch (error) {
    // Trả về cấu trúc lỗi chuẩn hóa theo thiết kế hệ thống
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

/**
 * Điều phối Đăng nhập hệ thống
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ Email và Mật khẩu."
      });
    }

    // Gọi Tầng Service kiểm tra thông tin và cấp mã JWT
    const result = await authService.login(email, password);

    // Trả về HTTP Code 200 (OK) kèm theo Token định danh
    return res.status(200).json({
      success: true,
      token: result.token,
      user: result.user
    });

  } catch (error) {
    // Trả về mã lỗi 401 (Unauthorized) nếu thông tin đăng nhập sai
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  register,
  login
};