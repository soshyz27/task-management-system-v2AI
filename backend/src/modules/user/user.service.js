const userRepository = require("./user.repository");

async function getAllUsers() {
  return await userRepository.getAllUsers();
}

async function updateUserRole(id, role) {
  const validRoles = ["user", "admin"];
  if (!validRoles.includes(role)) {
    const error = new Error("Role không hợp lệ.");
    error.statusCode = 400;
    throw error;
  }
  const user = await userRepository.getUserById(id);
  if (!user) {
    const error = new Error("Không tìm thấy người dùng.");
    error.statusCode = 404;
    throw error;
  }
  return await userRepository.updateUserRole(id, role);
}

async function deleteUser(id) {
  const user = await userRepository.getUserById(id);
  if (!user) {
    const error = new Error("Không tìm thấy người dùng.");
    error.statusCode = 404;
    throw error;
  }
  await userRepository.deleteUser(id);
}

module.exports = { getAllUsers, updateUserRole, deleteUser };