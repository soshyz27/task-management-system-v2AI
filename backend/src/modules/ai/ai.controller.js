const aiService = require("./ai.service");

/**
 * API gợi ý mô tả task
 * POST /api/ai/suggest
 * Body: { title: "..." }
 */
async function suggestDescription(req, res) {
  try {
    // Bảo vệ trường hợp body undefined
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body không hợp lệ."
      });
    }

    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập tiêu đề task trước."
      });
    }

    console.log("🤖 Bắt đầu gọi Gemini với title:", title);
    console.log("🔑 API Key tồn tại:", !!process.env.GEMINI_API_KEY);

    const description = await aiService.suggestTaskDescription(title);
    console.log("✅ Gemini trả về thành công");

    return res.status(200).json({
      success: true,
      data: { description }
    });

  } catch (error) {
    console.error("❌ Lỗi đầy đủ:", error.message);
    return res.status(500).json({
      success: false,
      message: "Không thể kết nối AI service.",
      debug: error.message
    });
  }
}

module.exports = { suggestDescription };