const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

/**
 * Logic Đăng ký tài khoản
 */
async function register(username, email, password) {
  // 1. Kiểm tra tài khoản đã tồn tại chưa
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new Error("Email này đã được đăng ký sử dụng.");
  }

  // 2. Mã hóa mật khẩu bảo mật (Salt round = 10 là chuẩn tối ưu hiện tại)
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 3. Lưu user vào Database qua tầng Repository
  const user = await userRepository.createUser(username, email, hashedPassword);

  return user;
}

/**
 * Logic Đăng nhập hệ thống
 */
async function login(email, password) {
  // 1. Kiểm tra email có tồn tại trong hệ thống không
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error("Thông tin đăng nhập không chính xác.");
  }

  // 2. So sánh mật khẩu text thô với chuỗi hash trong DB
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Thông tin đăng nhập không chính xác.");
  }

  // 3. Tạo Token bảo mật JWT (Thời hạn 7 ngày như thiết kế blueprint)
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // 4. Bảo mật: Xóa password khỏi object trước khi trả về cho Controller
  const userResponse = { ...user };
  delete userResponse.password;

  return {
    token,
    user: userResponse
  };
}

module.exports = {
  register,
  login
};