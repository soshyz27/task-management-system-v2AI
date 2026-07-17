const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODELS = [
  "gemini-2.5-flash-lite"
];

// ── Bước 1: getWorkingModel phải định nghĩa TRƯỚC khi dùng ──
async function getWorkingModel() {
  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      await model.generateContent("hi");
      console.log(`✅ Dùng model: ${modelName}`);
      return model;
    } catch {
      console.log(`❌ Model ${modelName} không khả dụng, thử tiếp...`);
    }
  }
  throw new Error("Không có model Gemini nào khả dụng.");
}

// ── Bước 2: Fallback phân tích bằng keyword ──
function analyzeByKeyword(title) {
  const t = title.toLowerCase();

  const rules = [
    {
      keywords: ["bug", "lỗi", "fix", "sửa lỗi", "crash", "broken",
                 "không vào", "không hoạt động", "không được", "bị lỗi",
                 "error", "exception", "failed", "thất bại"],
      priority: "high",
      category: "bug_fix"
    },
    {
      keywords: ["khẩn", "gấp", "urgent", "asap", "ngay", "hôm nay",
                 "bảo mật", "security", "hack", "tấn công"],
      priority: "high",
      category: "other"
    },
    {
      keywords: ["họp", "meeting", "review", "demo", "present"],
      priority: "medium",
      category: "meeting"
    },
    {
      keywords: ["báo cáo", "report", "thống kê", "tổng hợp"],
      priority: "medium",
      category: "report"
    },
    {
      keywords: ["thêm", "tạo", "build", "implement", "feature", "tính năng"],
      priority: "medium",
      category: "feature"
    },
    {
      keywords: ["đọc", "nghiên cứu", "tìm hiểu", "research", "tài liệu", "docs"],
      priority: "low",
      category: "research"
    }
  ];

  for (const rule of rules) {
    if (rule.keywords.some(kw => t.includes(kw))) {
      return { priority: rule.priority, category: rule.category };
    }
  }

  return { priority: "medium", category: "other" };
}

// ── Bước 3: suggestTaskDescription ──
async function suggestTaskDescription(title) {
  const model = await getWorkingModel();

  const prompt = `
Bạn là trợ lý quản lý công việc chuyên nghiệp.
Dựa vào tiêu đề task sau, hãy viết một mô tả ngắn gọn (2-4 câu) bằng tiếng Việt.
Mô tả cần:
- Nêu rõ mục tiêu cần đạt được
- Liệt kê 2-3 bước thực hiện chính
- Gợi ý tiêu chí hoàn thành

Tiêu đề task: "${title}"

Chỉ trả về mô tả, không giải thích thêm.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

// ── Bước 4: analyzeTaskPriority phải đứng SAU getWorkingModel ──
async function analyzeTaskPriority(title, description) {
  const model = await getWorkingModel(); // ← giờ getWorkingModel đã được định nghĩa

  const prompt = `
Bạn là hệ thống phân tích task quản lý công việc phần mềm.
Phân tích task sau và trả về JSON hợp lệ (KHÔNG có markdown, KHÔNG có backtick, KHÔNG giải thích):

Title: "${title}"
Description: "${description || ""}"

QUY TẮC PRIORITY (bắt buộc tuân theo):
- "high": task liên quan đến BUG, LỖI, FIX, SỬA, CRASH, KHÔNG HOẠT ĐỘNG, ẢNH HƯỞNG NGƯỜI DÙNG, BẢO MẬT, KHẨN CẤP, GẤP, DEADLINE HÔM NAY
- "medium": task liên quan đến TÍNH NĂNG MỚI, CẢI TIẾN, BÁO CÁO, HỌP, THÊM, CẬP NHẬT
- "low": task liên quan đến TÀI LIỆU, NGHIÊN CỨU, ĐỌC, TÌM HIỂU, REFACTOR, DỌN DẸP CODE

QUY TẮC CATEGORY (chọn 1):
- "bug_fix": sửa lỗi, fix bug, debug, crash
- "feature": tính năng mới, thêm chức năng
- "meeting": họp, meeting, review, demo
- "report": báo cáo, thống kê, tổng hợp
- "research": nghiên cứu, tìm hiểu, đọc tài liệu
- "other": không thuộc các loại trên

VÍ DỤ:
- "Fix bug đăng nhập" → high + bug_fix
- "Sửa lỗi thanh toán" → high + bug_fix
- "Thêm tính năng tìm kiếm" → medium + feature
- "Họp review sprint" → medium + meeting
- "Đọc tài liệu React" → low + research

Trả về ĐÚNG format này (không thêm bất cứ thứ gì khác):
{"priority":"high","category":"bug_fix","ai_notes":"lý do ngắn gọn tiếng Việt"}
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim()
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  console.log("🤖 Gemini raw response:", text);

  try {
    const parsed = JSON.parse(text);

    const validPriorities = ["high", "medium", "low"];
    const validCategories = ["bug_fix", "feature", "meeting", "report", "research", "other"];

    return {
      priority: validPriorities.includes(parsed.priority) ? parsed.priority : "medium",
      category: validCategories.includes(parsed.category) ? parsed.category : "other",
      ai_notes: parsed.ai_notes || ""
    };
  } catch {
    console.error("❌ JSON parse thất bại, dùng keyword fallback:", text);
    const fallback = analyzeByKeyword(title);
    return {
      ...fallback,
      ai_notes: "Phân tích tự động theo từ khóa"
    };
  }
}

// ── Export ──
module.exports = { suggestTaskDescription, analyzeTaskPriority };