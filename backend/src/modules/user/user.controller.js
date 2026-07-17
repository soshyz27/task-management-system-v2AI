const userService = require("./user.service");

async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await userService.updateUserRole(id, role);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message
    });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    // Ngăn admin tự xóa chính mình
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa tài khoản của chính mình."
      });
    }
    await userService.deleteUser(id);
    return res.status(200).json({
      success: true,
      message: "Xóa người dùng thành công."
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = { getAllUsers, updateUserRole, deleteUser };