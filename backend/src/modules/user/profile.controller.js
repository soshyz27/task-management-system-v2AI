const profileService = require("./profile.service");

async function getProfile(req, res) {
  try {
    const profile = await profileService.getProfile(req.user.id);
    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false, message: error.message
    });
  }
}

async function updateUsername(req, res) {
  try {
    const { username } = req.body;
    const updated = await profileService.updateUsername(req.user.id, username);
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false, message: error.message
    });
  }
}

async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    await profileService.changePassword(req.user.id, currentPassword, newPassword);
    return res.status(200).json({
      success: true,
      message: "Đổi mật khẩu thành công."
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false, message: error.message
    });
  }
}

module.exports = { getProfile, updateUsername, changePassword };